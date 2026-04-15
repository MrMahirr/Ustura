import {
  ConflictException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import type { DatabaseTransaction } from '../../database/database.types';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import { ERROR_CODES } from '../../shared/errors/error-codes';
import { Role } from '../../shared/auth/role.enum';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditLogAction } from '../audit-log/enums/audit-log-action.enum';
import { AuditLogEntityType } from '../audit-log/enums/audit-log-entity-type.enum';
import type { Salon } from '../salon/interfaces/salon.types';
import type { User } from '../user/interfaces/user.types';
import { StaffPolicy } from './policies/staff.policy';
import { StaffRepository } from './repositories/staff.repository';
import { StaffService } from './staff.service';
import type { StaffMember } from './interfaces/staff.types';

function createOwnerPayload(overrides: Record<string, unknown> = {}) {
  return {
    sub: 'owner-1',
    email: 'owner@example.com',
    role: Role.OWNER,
    tokenType: 'access',
    ...overrides,
  };
}

function createStaffPayload(overrides: Record<string, unknown> = {}) {
  return {
    sub: 'user-1',
    email: 'staff@example.com',
    role: Role.BARBER,
    tokenType: 'access',
    ...overrides,
  };
}

function createSalon(overrides: Partial<Salon> = {}): Salon {
  return {
    id: 'salon-1',
    ownerId: 'owner-1',
    name: 'Ustura Barber',
    address: 'Istanbul Street 10',
    city: 'Istanbul',
    district: 'Besiktas',
    photoUrl: null,
    workingHours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
    isActive: true,
    createdAt: new Date('2026-04-09T00:00:00.000Z'),
    updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    ...overrides,
  };
}

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Barber User',
    email: 'barber@example.com',
    phone: '+905551112233',
    passwordHash: 'hashed-password',
    firebaseUid: null,
    role: Role.BARBER,
    isActive: true,
    mustChangePassword: false,
    createdAt: new Date('2026-04-09T00:00:00.000Z'),
    updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    ...overrides,
  };
}

function createStaffMember(overrides: Partial<StaffMember> = {}): StaffMember {
  return {
    id: 'staff-1',
    userId: 'user-1',
    salonId: 'salon-1',
    displayName: 'Barber User',
    role: Role.BARBER,
    bio: null,
    photoUrl: null,
    isActive: true,
    createdAt: new Date('2026-04-09T00:00:00.000Z'),
    updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    ...overrides,
  };
}

function getExceptionCode(error: unknown): string | undefined {
  if (!(error instanceof HttpException)) {
    return undefined;
  }

  const response = error.getResponse();

  if (
    typeof response !== 'object' ||
    response == null ||
    !('code' in response)
  ) {
    return undefined;
  }

  return typeof response.code === 'string' ? response.code : undefined;
}

describe('StaffService', () => {
  let service: StaffService;
  let staffRepository: jest.Mocked<StaffRepository>;
  let salonCatalogService: { findActiveById: jest.Mock };
  let userQueryService: { findByPrincipal: jest.Mock };
  let userProvisioningService: { createEmployee: jest.Mock };
  let databaseService: { transaction: jest.Mock };
  let auditLogService: jest.Mocked<Pick<AuditLogService, 'recordBestEffort'>>;
  let domainEventBus: jest.Mocked<Pick<DomainEventBus, 'publish'>>;
  let emailService: { sendStaffWelcomeEmail: jest.Mock };
  let appConfig: { frontend: { baseUrl: string } };

  beforeEach(() => {
    staffRepository = {
      findById: jest.fn(),
      findBySalonId: jest.fn(),
      findActiveBySalonId: jest.fn(),
      findActiveBarbersBySalonId: jest.fn(),
      findActiveByUserId: jest.fn(),
      findActiveByUserIdAndSalon: jest.fn(),
      findByUserIdAndSalon: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
    } as unknown as jest.Mocked<StaffRepository>;
    salonCatalogService = {
      findActiveById: jest.fn(),
    };
    userQueryService = {
      findByPrincipal: jest.fn(),
    };
    userProvisioningService = {
      createEmployee: jest.fn(),
    };
    databaseService = {
      transaction: jest.fn(
        async (operation: (tx: DatabaseTransaction) => Promise<unknown>) =>
          operation({ query: jest.fn() } as DatabaseTransaction),
      ),
    };
    auditLogService = {
      recordBestEffort: jest.fn(),
    };
    domainEventBus = {
      publish: jest.fn(),
    };
    emailService = {
      sendStaffWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
    };
    appConfig = {
      frontend: { baseUrl: 'http://localhost:8081' },
    };

    service = new StaffService(
      staffRepository,
      databaseService as unknown as DatabaseService,
      salonCatalogService as never,
      userQueryService as never,
      userProvisioningService as never,
      new StaffPolicy(),
      auditLogService as AuditLogService,
      domainEventBus as DomainEventBus,
      emailService as never,
      appConfig as never,
    );
  });

  it('lists active staff members for an active salon', async () => {
    const staffList = [createStaffMember()];
    salonCatalogService.findActiveById.mockResolvedValue(createSalon());
    staffRepository.findActiveBySalonId.mockResolvedValue(staffList);

    const result = await service.findBySalonId('salon-1');

    expect(result).toBe(staffList);
    expect(staffRepository.findActiveBySalonId).toHaveBeenCalledWith('salon-1');
  });

  it('creates a new employee account through the user provisioning contract before creating staff membership', async () => {
    salonCatalogService.findActiveById.mockResolvedValue(createSalon());
    userProvisioningService.createEmployee.mockResolvedValue(
      createUser({
        id: 'user-9',
        role: Role.RECEPTIONIST,
      }),
    );
    staffRepository.findByUserIdAndSalon.mockResolvedValue(null);
    staffRepository.create.mockResolvedValue(
      createStaffMember({
        id: 'staff-9',
        userId: 'user-9',
        role: Role.RECEPTIONIST,
        displayName: 'Reception User',
      }),
    );

    const result = await service.create(createOwnerPayload(), 'salon-1', {
      employee: {
        name: 'Reception User',
        email: 'reception@example.com',
        phone: '+905551119999',
        password: 'super-secret',
      },
      role: Role.RECEPTIONIST,
      bio: '  Front desk  ',
    });

    expect(databaseService.transaction).toHaveBeenCalledTimes(1);
    expect(userProvisioningService.createEmployee).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Reception User',
        email: 'reception@example.com',
        phone: '+905551119999',
        role: Role.RECEPTIONIST,
        passwordHash: expect.any(String),
        mustChangePassword: false,
      }),
      expect.any(Object),
    );
    expect(emailService.sendStaffWelcomeEmail).not.toHaveBeenCalled();
    expect(staffRepository.create).toHaveBeenCalledWith(
      {
        userId: 'user-9',
        salonId: 'salon-1',
        role: Role.RECEPTIONIST,
        bio: 'Front desk',
        photoUrl: null,
        isActive: true,
      },
      expect.any(Object),
    );
    expect(domainEventBus.publish).toHaveBeenCalledWith({
      name: 'staff.created',
      occurredAt: expect.any(Date),
      payload: {
        actorUserId: 'owner-1',
        actorRole: Role.OWNER,
        staffId: 'staff-9',
        userId: 'user-9',
        salonId: 'salon-1',
        staffRole: Role.RECEPTIONIST,
      },
    });
    expect(result.id).toBe('staff-9');
  });

  it('auto-generates password and emails staff when employee password is omitted', async () => {
    salonCatalogService.findActiveById.mockResolvedValue(createSalon());
    userProvisioningService.createEmployee.mockResolvedValue(
      createUser({
        id: 'user-auto',
        role: Role.BARBER,
      }),
    );
    staffRepository.findByUserIdAndSalon.mockResolvedValue(null);
    staffRepository.create.mockResolvedValue(
      createStaffMember({
        id: 'staff-auto',
        userId: 'user-auto',
        role: Role.BARBER,
      }),
    );

    await service.create(createOwnerPayload(), 'salon-1', {
      employee: {
        name: 'Auto Barber',
        email: 'auto@example.com',
        phone: '+905551118888',
      },
      role: Role.BARBER,
    });

    expect(userProvisioningService.createEmployee).toHaveBeenCalledWith(
      expect.objectContaining({
        mustChangePassword: true,
        passwordHash: expect.any(String),
      }),
      expect.any(Object),
    );
    expect(emailService.sendStaffWelcomeEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientEmail: 'auto@example.com',
        recipientName: 'Auto Barber',
        salonName: 'Ustura Barber',
        temporaryPassword: expect.any(String),
        loginUrl: expect.stringContaining('/personel/giris?token='),
      }),
    );
  });

  it('reactivates an existing inactive staff assignment instead of creating a duplicate row', async () => {
    salonCatalogService.findActiveById.mockResolvedValue(createSalon());
    userQueryService.findByPrincipal.mockResolvedValue(createUser());
    staffRepository.findByUserIdAndSalon.mockResolvedValue(
      createStaffMember({
        id: 'staff-9',
        isActive: false,
      }),
    );
    staffRepository.update.mockResolvedValue(
      createStaffMember({
        id: 'staff-9',
        bio: 'Senior barber',
        photoUrl: 'https://example.com/barber.jpg',
      }),
    );

    const result = await service.create(createOwnerPayload(), 'salon-1', {
      userId: 'user-1',
      role: Role.BARBER,
      bio: '  Senior barber  ',
      photoUrl: 'https://example.com/barber.jpg',
    });

    expect(staffRepository.update).toHaveBeenCalledWith('staff-9', {
      role: Role.BARBER,
      bio: 'Senior barber',
      photoUrl: 'https://example.com/barber.jpg',
      isActive: true,
    });
    expect(staffRepository.create).not.toHaveBeenCalled();
    expect(auditLogService.recordBestEffort).toHaveBeenCalledWith({
      actorUserId: 'owner-1',
      actorRole: Role.OWNER,
      action: AuditLogAction.STAFF_UPDATED,
      entityType: AuditLogEntityType.STAFF,
      entityId: 'staff-9',
      metadata: {
        salonId: 'salon-1',
        userId: 'user-1',
        role: Role.BARBER,
        reactivated: true,
      },
    });
    expect(result.id).toBe('staff-9');
  });

  it('rejects creating duplicate active staff assignments in the same salon', async () => {
    salonCatalogService.findActiveById.mockResolvedValue(createSalon());
    userQueryService.findByPrincipal.mockResolvedValue(createUser());
    staffRepository.findByUserIdAndSalon.mockResolvedValue(createStaffMember());

    await expect(
      service.create(createOwnerPayload(), 'salon-1', {
        userId: 'user-1',
        role: Role.BARBER,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects provisioning payloads that send both userId and employee details', async () => {
    salonCatalogService.findActiveById.mockResolvedValue(createSalon());

    let capturedError: unknown;

    try {
      await service.create(createOwnerPayload(), 'salon-1', {
        userId: 'user-1',
        employee: {
          name: 'Employee',
          email: 'employee@example.com',
          phone: '+905551112233',
          password: 'super-secret',
        },
        role: Role.BARBER,
      });
    } catch (error) {
      capturedError = error;
    }

    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.STAFF.PROVISIONING_MODE_INVALID,
    );
  });

  it('returns active memberships for staff self view', async () => {
    const memberships = [
      createStaffMember(),
      createStaffMember({
        id: 'staff-2',
        salonId: 'salon-2',
      }),
    ];
    staffRepository.findActiveByUserId.mockResolvedValue(memberships);

    const result = await service.findMyAssignments(createStaffPayload());

    expect(result).toBe(memberships);
    expect(staffRepository.findActiveByUserId).toHaveBeenCalledWith('user-1');
  });

  it('rejects staff self view for non-staff roles', async () => {
    await expect(
      service.findMyAssignments(
        createStaffPayload({
          role: Role.OWNER,
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects creating staff assignments with user roles that do not match the staff role', async () => {
    salonCatalogService.findActiveById.mockResolvedValue(createSalon());
    userQueryService.findByPrincipal.mockResolvedValue(
      createUser({
        role: Role.RECEPTIONIST,
      }),
    );

    let capturedError: unknown;

    try {
      await service.create(createOwnerPayload(), 'salon-1', {
        userId: 'user-1',
        role: Role.BARBER,
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.STAFF.INVALID_ACCOUNT_ROLE,
    );
  });

  it('rejects deleting staff from salons owned by another owner', async () => {
    salonCatalogService.findActiveById.mockResolvedValue(
      createSalon({
        ownerId: 'owner-2',
      }),
    );

    let capturedError: unknown;

    try {
      await service.delete(createOwnerPayload(), 'salon-1', 'staff-1');
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.STAFF.MANAGEMENT_FORBIDDEN,
    );
  });

  it('returns not found when updating a staff member outside the requested salon scope', async () => {
    salonCatalogService.findActiveById.mockResolvedValue(createSalon());
    staffRepository.findById.mockResolvedValue(
      createStaffMember({
        salonId: 'salon-2',
      }),
    );

    let capturedError: unknown;

    try {
      await service.update(createOwnerPayload(), 'salon-1', 'staff-1', {
        bio: 'Updated bio',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(NotFoundException);
    expect(getExceptionCode(capturedError)).toBe(ERROR_CODES.STAFF.NOT_FOUND);
  });
});
