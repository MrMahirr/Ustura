import { ConflictException, ForbiddenException, HttpException, NotFoundException } from '@nestjs/common';
import { ERROR_CODES } from '../../shared/errors/error-codes';
import { Role } from '../../shared/auth/role.enum';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AuditLogAction } from '../audit-log/enums/audit-log-action.enum';
import { AuditLogEntityType } from '../audit-log/enums/audit-log-entity-type.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import type { Salon } from '../salon/interfaces/salon.types';
import { SalonService } from '../salon/salon.service';
import type { User } from '../user/interfaces/user.types';
import { UserService } from '../user/user.service';
import { StaffPolicy } from './policies/staff.policy';
import { StaffRepository } from './repositories/staff.repository';
import { StaffService } from './staff.service';
import type { StaffMember } from './interfaces/staff.types';

function createOwnerPayload(overrides: Partial<JwtPayload> = {}): JwtPayload {
  return {
    sub: 'owner-1',
    email: 'owner@example.com',
    role: Role.OWNER,
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
    workingHours: {},
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

  if (typeof response !== 'object' || response == null || !('code' in response)) {
    return undefined;
  }

  return typeof response.code === 'string' ? response.code : undefined;
}

describe('StaffService', () => {
  let service: StaffService;
  let staffRepository: jest.Mocked<StaffRepository>;
  let salonService: jest.Mocked<Pick<SalonService, 'findActiveById'>>;
  let userService: jest.Mocked<UserService>;
  let auditLogService: jest.Mocked<Pick<AuditLogService, 'recordBestEffort'>>;

  beforeEach(() => {
    staffRepository = {
      findById: jest.fn(),
      findBySalonId: jest.fn(),
      findActiveBySalonId: jest.fn(),
      findActiveBarbersBySalonId: jest.fn(),
      findActiveByUserIdAndSalon: jest.fn(),
      findByUserIdAndSalon: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
    } as unknown as jest.Mocked<StaffRepository>;
    salonService = {
      findActiveById: jest.fn(),
    } as jest.Mocked<Pick<SalonService, 'findActiveById'>>;
    userService = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;
    auditLogService = {
      recordBestEffort: jest.fn(),
    };

    service = new StaffService(
      staffRepository,
      salonService as unknown as SalonService,
      userService,
      new StaffPolicy(),
      auditLogService as AuditLogService,
    );
  });

  it('lists active staff members for an active salon', async () => {
    const staffList = [createStaffMember()];
    salonService.findActiveById.mockResolvedValue(createSalon());
    staffRepository.findActiveBySalonId.mockResolvedValue(staffList);

    const result = await service.findBySalonId('salon-1');

    expect(result).toBe(staffList);
    expect(staffRepository.findActiveBySalonId).toHaveBeenCalledWith('salon-1');
  });

  it('reactivates an existing inactive staff assignment instead of creating a duplicate row', async () => {
    salonService.findActiveById.mockResolvedValue(createSalon());
    userService.findById.mockResolvedValue(createUser());
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
      user_id: 'user-1',
      role: Role.BARBER,
      bio: '  Senior barber  ',
      photo_url: 'https://example.com/barber.jpg',
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

  it('rejects creating staff assignments with user roles that do not match the staff role', async () => {
    salonService.findActiveById.mockResolvedValue(createSalon());
    userService.findById.mockResolvedValue(
      createUser({
        role: Role.RECEPTIONIST,
      }),
    );
    staffRepository.findByUserIdAndSalon.mockResolvedValue(null);

    let capturedError: unknown;

    try {
      await service.create(createOwnerPayload(), 'salon-1', {
        user_id: 'user-1',
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
    salonService.findActiveById.mockResolvedValue(
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
    salonService.findActiveById.mockResolvedValue(createSalon());
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
