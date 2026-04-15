import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from '../../config/config.service';
import { DatabaseService } from '../../database/database.service';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import { PrincipalKind } from '../../shared/auth/principal-kind.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { Role } from '../../shared/auth/role.enum';
import {
  EMAIL_SERVICE,
  type EmailServiceContract,
} from '../email/interfaces/email.types';
import { generateTemporaryPassword } from '../email/utils/password-generator';
import {
  SALON_OWNER_PROVISIONING_SERVICE,
  type SalonOwnerProvisioningServiceContract,
} from '../salon/interfaces/salon.contracts';
import type { User } from '../user/interfaces/user.types';
import {
  USER_PROVISIONING_SERVICE,
  USER_QUERY_SERVICE,
  type UserProvisioningServiceContract,
  type UserQueryServiceContract,
} from '../user/interfaces/user.contracts';
import { CreateOwnerApplicationDto } from './dto/create-owner-application.dto';
import { RejectOwnerApplicationDto } from './dto/reject-owner-application.dto';
import { UpdateOwnerApplicationDto } from './dto/update-owner-application.dto';
import {
  ownerApplicationAlreadyExistsError,
  ownerApplicationApplicantEmailUsedByStaffError,
  ownerApplicationApplicantOwnerInactiveError,
  ownerApplicationNotFoundError,
} from './errors/platform-admin.errors';
import type {
  OwnerApplication,
  OwnerApplicationRecord,
} from './interfaces/platform-admin.types';
import { PlatformAdminPolicy } from './policies/platform-admin.policy';
import { PlatformAdminRepository } from './repositories/platform-admin.repository';

@Injectable()
export class PlatformAdminService {
  private readonly logger = new Logger(PlatformAdminService.name);
  private readonly passwordCost = 12;

  constructor(
    private readonly platformAdminRepository: PlatformAdminRepository,
    private readonly platformAdminPolicy: PlatformAdminPolicy,
    private readonly databaseService: DatabaseService,
    @Inject(USER_QUERY_SERVICE)
    private readonly userQueryService: UserQueryServiceContract,
    @Inject(USER_PROVISIONING_SERVICE)
    private readonly userProvisioningService: UserProvisioningServiceContract,
    @Inject(SALON_OWNER_PROVISIONING_SERVICE)
    private readonly salonOwnerProvisioningService: SalonOwnerProvisioningServiceContract,
    private readonly domainEventBus: DomainEventBus,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: EmailServiceContract,
    private readonly appConfig: AppConfigService,
  ) {}

  async createOwnerApplication(
    createOwnerApplicationDto: CreateOwnerApplicationDto,
  ): Promise<OwnerApplication> {
    const applicantEmail = this.normalizeEmail(
      createOwnerApplicationDto.applicantEmail,
    );
    const existingApplication =
      await this.platformAdminRepository.findPendingByApplicantEmail(
        applicantEmail,
      );

    if (existingApplication) {
      throw ownerApplicationAlreadyExistsError();
    }

    const normalizedSalonInput =
      this.salonOwnerProvisioningService.prepareOwnedSalonInput({
        name: createOwnerApplicationDto.salonName,
        address: createOwnerApplicationDto.salonAddress,
        city: createOwnerApplicationDto.salonCity,
        district: createOwnerApplicationDto.salonDistrict,
        photoUrl: createOwnerApplicationDto.salonPhotoUrl,
        workingHours: createOwnerApplicationDto.salonWorkingHours,
      });
    const placeholderHash = await bcrypt.hash(
      generateTemporaryPassword(),
      this.passwordCost,
    );
    const createdApplication = await this.platformAdminRepository.create({
      applicantName: createOwnerApplicationDto.applicantName.trim(),
      applicantEmail,
      applicantPhone: createOwnerApplicationDto.applicantPhone.trim(),
      passwordHash: placeholderHash,
      salonName: normalizedSalonInput.name,
      salonAddress: normalizedSalonInput.address,
      salonCity: normalizedSalonInput.city,
      salonDistrict: normalizedSalonInput.district,
      salonPhotoUrl: normalizedSalonInput.photoUrl,
      salonWorkingHours: normalizedSalonInput.workingHours,
      notes:
        this.normalizeOptionalString(createOwnerApplicationDto.notes) ?? null,
    });

    return this.toOwnerApplication(createdApplication);
  }

  async listOwnerApplications(
    currentUser: JwtPayload,
  ): Promise<OwnerApplication[]> {
    this.platformAdminPolicy.assertCanManageOwnerApplications(currentUser);

    const applications = await this.platformAdminRepository.findAll();
    return applications.map((application) =>
      this.toOwnerApplication(application),
    );
  }

  async approveOwnerApplication(
    currentUser: JwtPayload,
    applicationId: string,
  ): Promise<OwnerApplication> {
    this.platformAdminPolicy.assertCanManageOwnerApplications(currentUser);

    const temporaryPassword = generateTemporaryPassword();

    const approvedApplication = await this.databaseService.transaction(
      async (transaction) => {
        const application =
          await this.platformAdminRepository.findByIdForUpdate(
            applicationId,
            transaction,
          );

        if (!application) {
          throw ownerApplicationNotFoundError();
        }

        this.platformAdminPolicy.assertPendingApplication(application);

        const normalizedEmail = application.applicantEmail.trim().toLowerCase();
        const existingPersonnel =
          await this.userQueryService.findByEmailForPrincipal(
            normalizedEmail,
            PrincipalKind.PERSONNEL,
          );

        let owner: User;

        if (!existingPersonnel) {
          const temporaryPasswordHash = await bcrypt.hash(
            temporaryPassword,
            this.passwordCost,
          );
          owner = await this.userProvisioningService.createOwner(
            {
              name: application.applicantName,
              email: application.applicantEmail,
              phone: application.applicantPhone,
              passwordHash: temporaryPasswordHash,
              mustChangePassword: true,
            },
            transaction,
          );
        } else if (existingPersonnel.role === Role.OWNER) {
          if (!existingPersonnel.isActive) {
            throw ownerApplicationApplicantOwnerInactiveError();
          }
          owner = await this.userProvisioningService.resetPersonnelPassword(
            existingPersonnel.id,
            temporaryPassword,
            { mustChangePassword: true },
            transaction,
          );
        } else {
          throw ownerApplicationApplicantEmailUsedByStaffError();
        }

        const salon = await this.salonOwnerProvisioningService.createOwnedSalon(
          owner.id,
          {
            name: application.salonName,
            address: application.salonAddress,
            city: application.salonCity,
            district: application.salonDistrict,
            photoUrl: application.salonPhotoUrl,
            workingHours: application.salonWorkingHours,
          },
          transaction,
        );
        const approvedApplication =
          await this.platformAdminRepository.markApproved(
            application.id,
            {
              reviewedByUserId: currentUser.sub,
              approvedOwnerUserId: owner.id,
              approvedSalonId: salon.id,
            },
            transaction,
          );

        if (!approvedApplication) {
          throw ownerApplicationNotFoundError();
        }

        return this.toOwnerApplication(approvedApplication);
      },
    );

    this.domainEventBus.publish({
      name: 'owner.approved',
      occurredAt: new Date(),
      payload: {
        applicationId: approvedApplication.id,
        applicantName: approvedApplication.applicantName,
        applicantEmail: approvedApplication.applicantEmail,
        salonName: approvedApplication.salonName,
        approvedAt: (
          approvedApplication.reviewedAt ?? new Date()
        ).toISOString(),
        reviewedByUserId: approvedApplication.reviewedByUserId,
        approvedOwnerUserId: approvedApplication.approvedOwnerUserId,
        approvedSalonId: approvedApplication.approvedSalonId,
      },
    });

    const loginUrl = this.buildUniqueLoginUrl(
      approvedApplication.applicantEmail,
    );

    this.emailService
      .sendOwnerApprovalEmail({
        recipientEmail: approvedApplication.applicantEmail,
        recipientName: approvedApplication.applicantName,
        salonName: approvedApplication.salonName,
        loginUrl,
        temporaryPassword,
      })
      .catch((err) =>
        this.logger.error(
          `Approval email failed for ${approvedApplication.applicantEmail}`,
          err instanceof Error ? err.stack : String(err),
        ),
      );

    return approvedApplication;
  }

  private buildUniqueLoginUrl(email: string): string {
    const baseUrl = this.appConfig.frontend.baseUrl.replace(/\/+$/, '');
    const token = Buffer.from(
      JSON.stringify({ email, ts: Date.now() }),
    ).toString('base64url');
    return `${baseUrl}/personel/giris?token=${token}`;
  }

  async updateOwnerApplication(
    currentUser: JwtPayload,
    applicationId: string,
    updateOwnerApplicationDto: UpdateOwnerApplicationDto,
  ): Promise<OwnerApplication> {
    this.platformAdminPolicy.assertCanManageOwnerApplications(currentUser);

    return this.databaseService.transaction(async (transaction) => {
      const application = await this.platformAdminRepository.findByIdForUpdate(
        applicationId,
        transaction,
      );

      if (!application) {
        throw ownerApplicationNotFoundError();
      }

      this.platformAdminPolicy.assertPendingApplication(application);

      const applicantEmail = this.normalizeEmail(
        updateOwnerApplicationDto.applicantEmail,
      );

      if (applicantEmail !== application.applicantEmail) {
        const existingWithEmail =
          await this.platformAdminRepository.findPendingByApplicantEmail(
            applicantEmail,
            transaction,
          );

        if (existingWithEmail && existingWithEmail.id !== applicationId) {
          throw ownerApplicationAlreadyExistsError();
        }
      }

      const normalizedSalonInput =
        this.salonOwnerProvisioningService.prepareOwnedSalonInput({
          name: updateOwnerApplicationDto.salonName,
          address: updateOwnerApplicationDto.salonAddress,
          city: updateOwnerApplicationDto.salonCity,
          district: updateOwnerApplicationDto.salonDistrict,
          photoUrl: application.salonPhotoUrl ?? undefined,
          workingHours: application.salonWorkingHours as Record<
            string,
            unknown
          >,
        });

      const updatedApplication =
        await this.platformAdminRepository.updatePendingById(
          application.id,
          {
            applicantName: updateOwnerApplicationDto.applicantName.trim(),
            applicantEmail,
            applicantPhone: updateOwnerApplicationDto.applicantPhone.trim(),
            salonName: normalizedSalonInput.name,
            salonAddress: normalizedSalonInput.address,
            salonCity: normalizedSalonInput.city,
            salonDistrict: normalizedSalonInput.district ?? null,
            salonPhotoUrl: normalizedSalonInput.photoUrl ?? null,
            salonWorkingHours: normalizedSalonInput.workingHours,
            notes:
              this.normalizeOptionalString(updateOwnerApplicationDto.notes) ??
              null,
          },
          transaction,
        );

      if (!updatedApplication) {
        throw ownerApplicationNotFoundError();
      }

      return this.toOwnerApplication(updatedApplication);
    });
  }

  async rejectOwnerApplication(
    currentUser: JwtPayload,
    applicationId: string,
    rejectOwnerApplicationDto: RejectOwnerApplicationDto,
  ): Promise<OwnerApplication> {
    this.platformAdminPolicy.assertCanManageOwnerApplications(currentUser);

    return this.databaseService.transaction(async (transaction) => {
      const application = await this.platformAdminRepository.findByIdForUpdate(
        applicationId,
        transaction,
      );

      if (!application) {
        throw ownerApplicationNotFoundError();
      }

      this.platformAdminPolicy.assertPendingApplication(application);

      const rejectedApplication =
        await this.platformAdminRepository.markRejected(
          application.id,
          currentUser.sub,
          rejectOwnerApplicationDto.reason.trim(),
          transaction,
        );

      if (!rejectedApplication) {
        throw ownerApplicationNotFoundError();
      }

      return this.toOwnerApplication(rejectedApplication);
    });
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }

  private toOwnerApplication(
    application: OwnerApplicationRecord,
  ): OwnerApplication {
    const { passwordHash, ...ownerApplication } = application;
    void passwordHash;
    return ownerApplication;
  }
}
