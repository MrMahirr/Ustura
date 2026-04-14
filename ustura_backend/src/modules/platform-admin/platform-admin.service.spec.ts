import {
  ConflictException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../database/database.service';
import type { DatabaseTransaction } from '../../database/database.types';
import { DomainEventBus } from '../../events/domain-event-bus.service';
import { PrincipalKind } from '../../shared/auth/principal-kind.enum';
import { Role } from '../../shared/auth/role.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { ERROR_CODES } from '../../shared/errors/error-codes';
import type { Salon } from '../salon/interfaces/salon.types';
import { SalonService } from '../salon/salon.service';
import type { User } from '../user/interfaces/user.types';
import { UserService } from '../user/user.service';
import { UpdateOwnerApplicationDto } from './dto/update-owner-application.dto';
import { OwnerApplicationStatus } from './enums/owner-application-status.enum';
import type { OwnerApplicationRecord } from './interfaces/platform-admin.types';
import { PlatformAdminPolicy } from './policies/platform-admin.policy';
import { PlatformAdminRepository } from './repositories/platform-admin.repository';
import { PlatformAdminService } from './platform-admin.service';

function createSuperAdminPayload(
  overrides: Partial<JwtPayload> = {},
): JwtPayload {
  return {
    sub: 'super-admin-1',
    email: 'admin@example.com',
    role: Role.SUPER_ADMIN,
    tokenType: 'access',
    ...overrides,
  };
}

function createOwnerApplication(
  overrides: Partial<OwnerApplicationRecord> = {},
): OwnerApplicationRecord {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    applicantName: 'Jane Owner',
    applicantEmail: 'owner@example.com',
    applicantPhone: '+905551112233',
    passwordHash: 'hashed-password',
    salonName: 'Ustura Premium',
    salonAddress: 'Istanbul Street 10',
    salonCity: 'Istanbul',
    salonDistrict: 'Besiktas',
    salonPhotoUrl: 'https://example.com/salon.jpg',
    salonWorkingHours: {
      monday: { open: '09:00', close: '19:00' },
      sunday: null,
    },
    status: OwnerApplicationStatus.PENDING,
    notes: 'First branch',
    reviewedAt: null,
    reviewedByUserId: null,
    rejectionReason: null,
    approvedOwnerUserId: null,
    approvedSalonId: null,
    createdAt: new Date('2026-04-09T00:00:00.000Z'),
    updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    ...overrides,
  };
}

function createOwner(overrides: Partial<User> = {}): User {
  return {
    id: 'owner-1',
    name: 'Jane Owner',
    email: 'owner@example.com',
    phone: '+905551112233',
    passwordHash: 'hashed-password',
    firebaseUid: null,
    role: Role.OWNER,
    isActive: true,
    mustChangePassword: false,
    createdAt: new Date('2026-04-09T00:00:00.000Z'),
    updatedAt: new Date('2026-04-09T00:00:00.000Z'),
    ...overrides,
  };
}

function createSalon(overrides: Partial<Salon> = {}): Salon {
  return {
    id: 'salon-1',
    ownerId: 'owner-1',
    name: 'Ustura Premium',
    address: 'Istanbul Street 10',
    city: 'Istanbul',
    district: 'Besiktas',
    photoUrl: 'https://example.com/salon.jpg',
    workingHours: {
      monday: { open: '09:00', close: '19:00' },
      sunday: null,
    },
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

describe('PlatformAdminService', () => {
  let service: PlatformAdminService;
  let repository: jest.Mocked<PlatformAdminRepository>;
  let databaseService: jest.Mocked<Pick<DatabaseService, 'transaction'>>;
  let userQueryService: jest.Mocked<Pick<UserService, 'findByEmailForPrincipal'>>;
  let userService: jest.Mocked<Pick<UserService, 'createOwner'>>;
  let salonService: jest.Mocked<
    Pick<SalonService, 'prepareOwnedSalonInput' | 'createOwnedSalon'>
  >;
  let domainEventBus: jest.Mocked<Pick<DomainEventBus, 'publish'>>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findPendingByApplicantEmail: jest.fn(),
      findAll: jest.fn(),
      findByIdForUpdate: jest.fn(),
      markApproved: jest.fn(),
      markRejected: jest.fn(),
      updatePendingById: jest.fn(),
    } as unknown as jest.Mocked<PlatformAdminRepository>;
    databaseService = {
      transaction: jest.fn(),
    };
    userQueryService = {
      findByEmailForPrincipal: jest.fn().mockResolvedValue(null),
    };
    userService = {
      createOwner: jest.fn(),
    };
    salonService = {
      prepareOwnedSalonInput: jest.fn(),
      createOwnedSalon: jest.fn(),
    };
    domainEventBus = {
      publish: jest.fn(),
    };

    databaseService.transaction.mockImplementation(async (operation) => {
      const transaction = {
        query: jest.fn(),
      } as unknown as DatabaseTransaction;
      return operation(transaction);
    });

    const mockEmailService = {
      sendOwnerApprovalEmail: jest.fn().mockResolvedValue({ success: true }),
      sendStaffWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
    };
    const mockAppConfig = {
      emailJs: {
        serviceId: '',
        templateApproval: '',
        templateStaffWelcome: '',
        publicKey: '',
        privateKey: '',
      },
      frontend: { baseUrl: 'http://localhost:8081' },
    };

    service = new PlatformAdminService(
      repository,
      new PlatformAdminPolicy(),
      databaseService as DatabaseService,
      userQueryService as UserService,
      userService as UserService,
      salonService as unknown as SalonService,
      domainEventBus as DomainEventBus,
      mockEmailService as any,
      mockAppConfig as any,
    );
  });

  it('creates a normalized owner application and stores a hashed password', async () => {
    salonService.prepareOwnedSalonInput.mockReturnValue({
      name: 'Ustura Premium',
      address: 'Istanbul Street 10',
      city: 'Istanbul',
      district: 'Besiktas',
      photoUrl: 'https://example.com/salon.jpg',
      workingHours: {
        monday: { open: '09:00', close: '19:00' },
        sunday: null,
      },
    });
    repository.findPendingByApplicantEmail.mockResolvedValue(null);
    repository.create.mockImplementation(async (input) =>
      createOwnerApplication({
        applicantName: input.applicantName,
        applicantEmail: input.applicantEmail,
        applicantPhone: input.applicantPhone,
        passwordHash: input.passwordHash,
      }),
    );

    const result = await service.createOwnerApplication({
      applicantName: ' Jane Owner ',
      applicantEmail: ' OWNER@EXAMPLE.COM ',
      applicantPhone: ' +905551112233 ',
      password: 'password123',
      salonName: ' Ustura Premium ',
      salonAddress: ' Istanbul Street 10 ',
      salonCity: ' Istanbul ',
      salonDistrict: ' Besiktas ',
      salonPhotoUrl: 'https://example.com/salon.jpg',
      salonWorkingHours: {
        monday: { open: '09:00', close: '19:00' },
      },
      notes: ' First branch ',
    });

    expect(repository.findPendingByApplicantEmail).toHaveBeenCalledWith(
      'owner@example.com',
    );
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        applicantName: 'Jane Owner',
        applicantEmail: 'owner@example.com',
        applicantPhone: '+905551112233',
        notes: 'First branch',
      }),
    );
    const storedHash = repository.create.mock.calls[0][0].passwordHash;
    expect(typeof storedHash).toBe('string');
    expect(storedHash.startsWith('$2')).toBe(true);
    expect(await bcrypt.compare('password123', storedHash)).toBe(false);
    expect((result as OwnerApplicationRecord & { passwordHash?: string }).passwordHash).toBeUndefined();
  });

  it('approves a pending owner application in a transaction and provisions owner plus salon', async () => {
    const pendingApplication = createOwnerApplication();
    repository.findByIdForUpdate.mockResolvedValue(pendingApplication);
    userQueryService.findByEmailForPrincipal.mockResolvedValue(null);
    userService.createOwner.mockResolvedValue(createOwner());
    salonService.createOwnedSalon.mockResolvedValue(createSalon());
    repository.markApproved.mockResolvedValue(
      createOwnerApplication({
        status: OwnerApplicationStatus.APPROVED,
        reviewedAt: new Date('2026-04-09T12:00:00.000Z'),
        reviewedByUserId: 'super-admin-1',
        approvedOwnerUserId: 'owner-1',
        approvedSalonId: 'salon-1',
      }),
    );

    const result = await service.approveOwnerApplication(
      createSuperAdminPayload(),
      pendingApplication.id,
    );

    expect(userQueryService.findByEmailForPrincipal).toHaveBeenCalledWith(
      'owner@example.com',
      PrincipalKind.PERSONNEL,
    );
    expect(userService.createOwner).toHaveBeenCalled();
    expect(salonService.createOwnedSalon).toHaveBeenCalledWith(
      'owner-1',
      {
        name: pendingApplication.salonName,
        address: pendingApplication.salonAddress,
        city: pendingApplication.salonCity,
        district: pendingApplication.salonDistrict,
        photoUrl: pendingApplication.salonPhotoUrl,
        workingHours: pendingApplication.salonWorkingHours,
      },
      expect.any(Object),
    );
    expect(repository.markApproved).toHaveBeenCalledWith(
      pendingApplication.id,
      {
        reviewedByUserId: 'super-admin-1',
        approvedOwnerUserId: 'owner-1',
        approvedSalonId: 'salon-1',
      },
      expect.any(Object),
    );
    expect(domainEventBus.publish).toHaveBeenCalledWith({
      name: 'owner.approved',
      occurredAt: expect.any(Date),
      payload: {
        applicationId: pendingApplication.id,
        applicantName: pendingApplication.applicantName,
        applicantEmail: pendingApplication.applicantEmail,
        salonName: pendingApplication.salonName,
        approvedAt: '2026-04-09T12:00:00.000Z',
        reviewedByUserId: 'super-admin-1',
        approvedOwnerUserId: 'owner-1',
        approvedSalonId: 'salon-1',
      },
    });
    expect(result.status).toBe(OwnerApplicationStatus.APPROVED);
  });

  it('approves by linking a new salon to an existing active owner with the same email', async () => {
    const pendingApplication = createOwnerApplication();
    const existingOwner = createOwner({
      id: 'existing-owner-id',
      email: 'owner@example.com',
    });
    repository.findByIdForUpdate.mockResolvedValue(pendingApplication);
    userQueryService.findByEmailForPrincipal.mockResolvedValue(existingOwner);
    salonService.createOwnedSalon.mockResolvedValue(createSalon());
    repository.markApproved.mockResolvedValue(
      createOwnerApplication({
        status: OwnerApplicationStatus.APPROVED,
        reviewedAt: new Date('2026-04-09T12:00:00.000Z'),
        reviewedByUserId: 'super-admin-1',
        approvedOwnerUserId: 'existing-owner-id',
        approvedSalonId: 'salon-1',
      }),
    );

    const result = await service.approveOwnerApplication(
      createSuperAdminPayload(),
      pendingApplication.id,
    );

    expect(userService.createOwner).not.toHaveBeenCalled();
    expect(salonService.createOwnedSalon).toHaveBeenCalledWith(
      'existing-owner-id',
      expect.any(Object),
      expect.any(Object),
    );
    expect(result.status).toBe(OwnerApplicationStatus.APPROVED);
  });

  it('rejects approval when the email belongs to non-owner personnel', async () => {
    repository.findByIdForUpdate.mockResolvedValue(createOwnerApplication());
    userQueryService.findByEmailForPrincipal.mockResolvedValue(
      createOwner({
        id: 'barber-1',
        role: Role.BARBER,
      }),
    );

    let capturedError: unknown;
    try {
      await service.approveOwnerApplication(
        createSuperAdminPayload(),
        '11111111-1111-1111-1111-111111111111',
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.PLATFORM_ADMIN.OWNER_APPLICATION_APPLICANT_EMAIL_USED_BY_STAFF,
    );
    expect(userService.createOwner).not.toHaveBeenCalled();
  });

  it('rejects non-super-admin access at service level', async () => {
    let capturedError: unknown;

    try {
      await service.listOwnerApplications(
        createSuperAdminPayload({
          role: Role.OWNER,
        }),
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.PLATFORM_ADMIN.ACCESS_FORBIDDEN,
    );
  });

  it('rejects approving an already reviewed application', async () => {
    userQueryService.findByEmailForPrincipal.mockResolvedValue(null);
    repository.findByIdForUpdate.mockResolvedValue(
      createOwnerApplication({
        status: OwnerApplicationStatus.REJECTED,
      }),
    );

    let capturedError: unknown;

    try {
      await service.approveOwnerApplication(
        createSuperAdminPayload(),
        '11111111-1111-1111-1111-111111111111',
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ConflictException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.PLATFORM_ADMIN.OWNER_APPLICATION_ALREADY_REVIEWED,
    );
  });

  it('updates a pending owner application and normalizes salon fields', async () => {
    const pendingApplication = createOwnerApplication();
    repository.findByIdForUpdate.mockResolvedValue(pendingApplication);
    repository.findPendingByApplicantEmail.mockResolvedValue(null);
    salonService.prepareOwnedSalonInput.mockReturnValue({
      name: 'New Salon',
      address: 'New Address',
      city: 'Ankara',
      district: null,
      photoUrl: pendingApplication.salonPhotoUrl,
      workingHours: pendingApplication.salonWorkingHours,
    });
    const updated = createOwnerApplication({
      applicantName: 'New Name',
      applicantEmail: 'new@example.com',
      applicantPhone: '+905551112299',
      salonName: 'New Salon',
      salonAddress: 'New Address',
      salonCity: 'Ankara',
      salonDistrict: null,
      notes: 'Updated',
    });
    repository.updatePendingById.mockResolvedValue(updated);

    const dto: UpdateOwnerApplicationDto = {
      applicantName: 'New Name',
      applicantEmail: 'new@example.com',
      applicantPhone: '+905551112299',
      salonName: 'New Salon',
      salonAddress: 'New Address',
      salonCity: 'Ankara',
      notes: 'Updated',
    };

    const result = await service.updateOwnerApplication(
      createSuperAdminPayload(),
      pendingApplication.id,
      dto,
    );

    expect(repository.findPendingByApplicantEmail).toHaveBeenCalledWith(
      'new@example.com',
      expect.any(Object),
    );
    expect(repository.updatePendingById).toHaveBeenCalled();
    expect(result.applicantName).toBe('New Name');
    expect(result.salonCity).toBe('Ankara');
  });
});
