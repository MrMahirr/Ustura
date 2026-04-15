import * as bcrypt from 'bcrypt';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import { DatabaseService } from '../../database/database.service';
import type { SqlQueryExecutor } from '../../database/database.types';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import { PrincipalKind } from '../../shared/auth/principal-kind.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditLogAction } from '../audit-log/enums/audit-log-action.enum';
import { AuditLogEntityType } from '../audit-log/enums/audit-log-entity-type.enum';
import {
  EMAIL_SERVICE,
  type EmailServiceContract,
} from '../email/interfaces/email.types';
import { generateTemporaryPassword } from '../email/utils/password-generator';
import {
  SALON_CATALOG_SERVICE,
  type SalonCatalogServiceContract,
} from '../salon/interfaces/salon.contracts';
import {
  USER_PROVISIONING_SERVICE,
  USER_QUERY_SERVICE,
  type UserProvisioningServiceContract,
  type UserQueryServiceContract,
} from '../user/interfaces/user.contracts';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import {
  staffAlreadyAssignedError,
  staffNotFoundError,
  staffSalonNotFoundError,
  staffUserNotFoundError,
} from './errors/staff.errors';
import type {
  CreateStaffInput,
  StaffMember,
  UpdateStaffInput,
} from './interfaces/staff.types';
import { StaffPolicy } from './policies/staff.policy';
import { StaffRepository } from './repositories/staff.repository';

@Injectable()
export class StaffService {
  private readonly passwordCost = 12;
  private readonly logger = new Logger(StaffService.name);

  constructor(
    private readonly staffRepository: StaffRepository,
    private readonly databaseService: DatabaseService,
    @Inject(SALON_CATALOG_SERVICE)
    private readonly salonCatalogService: SalonCatalogServiceContract,
    @Inject(USER_QUERY_SERVICE)
    private readonly userQueryService: UserQueryServiceContract,
    @Inject(USER_PROVISIONING_SERVICE)
    private readonly userProvisioningService: UserProvisioningServiceContract,
    private readonly staffPolicy: StaffPolicy,
    private readonly auditLogService: AuditLogService,
    private readonly domainEventBus: DomainEventBus,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: EmailServiceContract,
    private readonly appConfig: AppConfigService,
  ) {}

  async findBySalonId(salonId: string): Promise<StaffMember[]> {
    await this.requireSalon(salonId);
    return this.staffRepository.findActiveBySalonId(salonId);
  }

  async findMyAssignments(currentUser: JwtPayload): Promise<StaffMember[]> {
    this.staffPolicy.assertCanViewOwnAssignments(currentUser);
    return this.staffRepository.findActiveByUserId(currentUser.sub);
  }

  async create(
    currentUser: JwtPayload,
    salonId: string,
    createStaffDto: CreateStaffDto,
  ): Promise<StaffMember> {
    const salon = await this.requireSalon(salonId);
    this.staffPolicy.assertCanManageSalonStaff(currentUser, salon.ownerId);
    this.staffPolicy.assertValidProvisioningSelection({
      userId: createStaffDto.userId,
      employee: createStaffDto.employee,
    });

    const membershipInput = {
      salonId,
      role: createStaffDto.role,
      bio: this.normalizeOptionalString(createStaffDto.bio) ?? null,
      photoUrl: this.normalizeOptionalString(createStaffDto.photoUrl) ?? null,
    } as const;

    if (createStaffDto.userId) {
      const user = await this.requireUser(createStaffDto.userId);
      this.staffPolicy.assertCanAssignUserToRole(user, createStaffDto.role);

      return this.createOrReactivateMembership(currentUser, {
        ...membershipInput,
        userId: user.id,
      });
    }

    const employee = createStaffDto.employee!;
    const explicitPassword = employee.password?.trim();
    const provisionalPassword = explicitPassword ?? generateTemporaryPassword();
    const mustChangePassword = !explicitPassword;

    const staffMember = await this.databaseService.transaction(
      async (transaction) => {
        const passwordHash = await bcrypt.hash(
          provisionalPassword,
          this.passwordCost,
        );
        const user = await this.userProvisioningService.createEmployee(
          {
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            passwordHash,
            role: createStaffDto.role,
            mustChangePassword,
          },
          transaction,
        );

        return this.createOrReactivateMembership(
          currentUser,
          {
            ...membershipInput,
            userId: user.id,
          },
          transaction,
        );
      },
    );

    if (mustChangePassword) {
      const loginUrl = this.buildStaffLoginUrl(employee.email);
      this.emailService
        .sendStaffWelcomeEmail({
          recipientEmail: employee.email,
          recipientName: employee.name,
          salonName: salon.name,
          temporaryPassword: provisionalPassword,
          loginUrl,
        })
        .catch((err) =>
          this.logger.error(
            `Staff welcome email failed for ${employee.email}`,
            err instanceof Error ? err.stack : String(err),
          ),
        );
    }

    return staffMember;
  }

  async update(
    currentUser: JwtPayload,
    salonId: string,
    staffId: string,
    updateStaffDto: UpdateStaffDto,
  ): Promise<StaffMember> {
    const salon = await this.requireSalon(salonId);
    this.staffPolicy.assertCanManageSalonStaff(currentUser, salon.ownerId);

    const existingStaffMember = await this.requireStaffMember(salonId, staffId);
    const nextRole = updateStaffDto.role ?? existingStaffMember.role;
    const normalizedInput = this.normalizeUpdateInput(updateStaffDto);
    const normalizedAccountInput = this.normalizeManagedAccountInput(
      updateStaffDto,
      nextRole,
    );
    const hasStaffChanges = Object.keys(normalizedInput).length > 0;
    const hasAccountChanges = Object.keys(normalizedAccountInput).length > 0;

    if (!hasStaffChanges && !hasAccountChanges) {
      return existingStaffMember;
    }

    const updatedStaffMember = await this.databaseService.transaction(
      async (transaction) => {
        if (hasAccountChanges) {
          await this.userProvisioningService.updateManagedEmployee(
            existingStaffMember.userId,
            normalizedAccountInput,
            transaction,
          );
        }

        if (!hasStaffChanges) {
          return (
            (await this.staffRepository.findById(
              existingStaffMember.id,
              transaction,
            )) ?? existingStaffMember
          );
        }

        const updated = await this.staffRepository.update(
          existingStaffMember.id,
          normalizedInput,
          transaction,
        );

        if (!updated) {
          throw staffNotFoundError();
        }

        return updated;
      },
    );

    if (!updatedStaffMember) {
      throw staffNotFoundError();
    }

    this.recordStaffAudit(
      currentUser,
      AuditLogAction.STAFF_UPDATED,
      updatedStaffMember,
      {
        salonId,
        changes: normalizedInput,
        accountChanges: hasAccountChanges
          ? {
              name: normalizedAccountInput.name !== undefined,
              email: normalizedAccountInput.email !== undefined,
              phone: normalizedAccountInput.phone !== undefined,
              password: normalizedAccountInput.password !== undefined,
              role: normalizedAccountInput.role !== undefined,
            }
          : undefined,
      },
    );

    return updatedStaffMember;
  }

  async delete(
    currentUser: JwtPayload,
    salonId: string,
    staffId: string,
  ): Promise<StaffMember> {
    const salon = await this.requireSalon(salonId);
    this.staffPolicy.assertCanManageSalonStaff(currentUser, salon.ownerId);

    const existingStaffMember = await this.requireStaffMember(salonId, staffId);

    if (!existingStaffMember.isActive) {
      return existingStaffMember;
    }

    const deactivatedStaffMember = await this.staffRepository.deactivate(
      existingStaffMember.id,
    );

    if (!deactivatedStaffMember) {
      throw staffNotFoundError();
    }

    this.recordStaffAudit(
      currentUser,
      AuditLogAction.STAFF_DEACTIVATED,
      deactivatedStaffMember,
      {
        salonId,
      },
    );

    return deactivatedStaffMember;
  }

  async findById(staffId: string): Promise<StaffMember | null> {
    return this.staffRepository.findById(staffId);
  }

  async findActiveBarbersBySalonId(salonId: string): Promise<StaffMember[]> {
    return this.staffRepository.findActiveBarbersBySalonId(salonId);
  }

  async findActiveByUserIdAndSalon(
    userId: string,
    salonId: string,
  ): Promise<StaffMember | null> {
    return this.staffRepository.findActiveByUserIdAndSalon(userId, salonId);
  }

  private async createOrReactivateMembership(
    currentUser: JwtPayload,
    input: CreateStaffInput,
    executor: SqlQueryExecutor = this.databaseService,
  ): Promise<StaffMember> {
    const existingStaffMember = await this.staffRepository.findByUserIdAndSalon(
      input.userId,
      input.salonId,
    );

    this.staffPolicy.assertCanCreate(existingStaffMember);

    if (existingStaffMember) {
      const reactivatedStaffMember = await this.staffRepository.update(
        existingStaffMember.id,
        {
          role: input.role,
          bio: input.bio ?? null,
          photoUrl: input.photoUrl ?? null,
          isActive: true,
        },
      );

      if (!reactivatedStaffMember) {
        throw staffNotFoundError();
      }

      this.recordStaffAudit(
        currentUser,
        AuditLogAction.STAFF_UPDATED,
        reactivatedStaffMember,
        {
          salonId: input.salonId,
          userId: input.userId,
          reactivated: true,
        },
      );

      return reactivatedStaffMember;
    }

    try {
      const createdStaffMember = await this.staffRepository.create(
        {
          userId: input.userId,
          salonId: input.salonId,
          role: input.role,
          bio: input.bio ?? null,
          photoUrl: input.photoUrl ?? null,
          isActive: true,
        },
        executor,
      );

      this.domainEventBus.publish({
        name: 'staff.created',
        occurredAt: new Date(),
        payload: {
          actorUserId: currentUser.sub,
          actorRole: currentUser.role,
          staffId: createdStaffMember.id,
          userId: input.userId,
          salonId: input.salonId,
          staffRole: createdStaffMember.role,
        },
      });

      return createdStaffMember;
    } catch (error) {
      if (error instanceof DatabaseConstraintViolationError) {
        throw staffAlreadyAssignedError();
      }

      throw error;
    }
  }

  private async requireSalon(salonId: string) {
    const salon = await this.salonCatalogService.findActiveById(salonId);

    if (!salon) {
      throw staffSalonNotFoundError();
    }

    return salon;
  }

  private async requireStaffMember(
    salonId: string,
    staffId: string,
  ): Promise<StaffMember> {
    const staffMember = await this.staffRepository.findById(staffId);

    if (!staffMember || staffMember.salonId !== salonId) {
      throw staffNotFoundError();
    }

    return staffMember;
  }

  private async requireUser(userId: string) {
    const user = await this.userQueryService.findByPrincipal(
      PrincipalKind.PERSONNEL,
      userId,
    );

    if (!user) {
      throw staffUserNotFoundError();
    }

    return user;
  }

  private normalizeUpdateInput(
    updateStaffDto: UpdateStaffDto,
  ): UpdateStaffInput {
    const normalizedInput: UpdateStaffInput = {};

    if (updateStaffDto.role !== undefined) {
      normalizedInput.role = updateStaffDto.role;
    }

    if (updateStaffDto.bio !== undefined) {
      normalizedInput.bio =
        this.normalizeOptionalString(updateStaffDto.bio) ?? null;
    }

    if (updateStaffDto.photoUrl !== undefined) {
      normalizedInput.photoUrl =
        this.normalizeOptionalString(updateStaffDto.photoUrl) ?? null;
    }

    if (updateStaffDto.isActive !== undefined) {
      normalizedInput.isActive = updateStaffDto.isActive;
    }

    return normalizedInput;
  }

  private normalizeManagedAccountInput(
    updateStaffDto: UpdateStaffDto,
    role: StaffMember['role'],
  ) {
    const normalizedInput: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      role?: StaffMember['role'];
      mustChangePassword?: boolean;
    } = {};

    const account = updateStaffDto.account;

    if (account?.name !== undefined) {
      normalizedInput.name = account.name.trim();
    }

    if (account?.email !== undefined) {
      normalizedInput.email = account.email.trim().toLowerCase();
    }

    if (account?.phone !== undefined) {
      normalizedInput.phone = account.phone.trim();
    }

    if (account?.password !== undefined) {
      normalizedInput.password = account.password.trim();
      normalizedInput.mustChangePassword = true;
    }

    if (updateStaffDto.role !== undefined) {
      normalizedInput.role = role;
    }

    return normalizedInput;
  }

  private buildStaffLoginUrl(email: string): string {
    const baseUrl = this.appConfig.frontend.baseUrl.replace(/\/+$/, '');
    const token = Buffer.from(
      JSON.stringify({ email, ts: Date.now() }),
    ).toString('base64url');
    return `${baseUrl}/personel/giris?token=${token}`;
  }

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }

  private recordStaffAudit(
    currentUser: JwtPayload,
    action: AuditLogAction,
    staffMember: StaffMember,
    metadata?: Record<string, unknown>,
  ): void {
    this.auditLogService.recordBestEffort({
      actorUserId: currentUser.sub,
      actorRole: currentUser.role,
      action,
      entityType: AuditLogEntityType.STAFF,
      entityId: staffMember.id,
      metadata: {
        salonId: staffMember.salonId,
        userId: staffMember.userId,
        role: staffMember.role,
        ...metadata,
      },
    });
  }
}
