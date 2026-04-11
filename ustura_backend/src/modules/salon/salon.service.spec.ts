import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { ERROR_CODES } from '../../shared/errors/error-codes';
import { Role } from '../../shared/auth/role.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import type {
  PaginatedResult,
  Salon,
} from './interfaces/salon.types';
import { SalonPolicy } from './policies/salon.policy';
import { SalonProjectionService } from './salon-projection.service';
import { SalonOwnershipService } from './salon-ownership.service';
import { SalonQueryService } from './salon-query.service';
import { SalonManagementService } from './salon-management.service';
import { SalonRepository } from './repositories/salon.repository';
import { SalonService } from './salon.service';
import { SalonWorkingHoursService } from './salon-working-hours.service';

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
    photoUrl: 'https://example.com/photo.jpg',
    workingHours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: null,
    },
    isActive: true,
    createdAt: new Date('2026-04-08T00:00:00.000Z'),
    updatedAt: new Date('2026-04-08T00:00:00.000Z'),
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

describe('SalonService', () => {
  let salonService: SalonService;
  let salonRepository: jest.Mocked<SalonRepository>;

  beforeEach(() => {
    salonRepository = {
      findAll: jest.fn(),
      findPublicPage: jest.fn(),
      findDistinctCities: jest.fn(),
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
    } as unknown as jest.Mocked<SalonRepository>;

    const configService = {
      reservation: {
        slotDurationMinutes: 30,
        slotSelectionTtlSeconds: 45,
        slotLockTtlSeconds: 5,
        businessUtcOffset: '+03:00',
        businessTimeZone: 'Europe/Istanbul',
      },
    } as AppConfigService;
    const salonPolicy = new SalonPolicy();
    const salonProjectionService = new SalonProjectionService();
    const salonOwnershipService = new SalonOwnershipService(
      salonRepository,
      salonPolicy,
    );
    const salonWorkingHoursService = new SalonWorkingHoursService(configService);
    const salonQueryService = new SalonQueryService(
      salonRepository,
      salonPolicy,
      salonProjectionService,
    );
    const salonManagementService = new SalonManagementService(
      salonRepository,
      salonPolicy,
      salonWorkingHoursService,
      salonOwnershipService,
      salonProjectionService,
    );

    salonService = new SalonService(salonQueryService, salonManagementService);
  });

  it('returns simplified public salon summaries for discovery', async () => {
    const paginatedResult: PaginatedResult<Salon> = {
      items: [createSalon()],
      pagination: {
        page: 2,
        pageSize: 3,
        total: 7,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    };
    salonRepository.findPublicPage.mockResolvedValue(paginatedResult);

    const result = await salonService.findAll({
      city: ' Istanbul ',
      search: ' Barber ',
      page: 2,
      pageSize: 3,
    });

    expect(salonRepository.findPublicPage).toHaveBeenCalledWith({
      city: 'Istanbul',
      search: 'Barber',
      page: 2,
      pageSize: 3,
    });
    expect(result).toEqual({
      items: [
        {
          id: 'salon-1',
          name: 'Ustura Barber',
          city: 'Istanbul',
          district: 'Besiktas',
          photoUrl: 'https://example.com/photo.jpg',
        },
      ],
      pagination: {
        page: 2,
        pageSize: 3,
        total: 7,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      },
    });
  });

  it('lists distinct active salon cities for public filters', async () => {
    salonRepository.findDistinctCities.mockResolvedValue(['Ankara', 'Istanbul']);

    const result = await salonService.findPublicCities();

    expect(salonRepository.findDistinctCities).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['Ankara', 'Istanbul']);
  });

  it('creates a salon with normalized string fields and owner detail projection', async () => {
    salonRepository.create.mockResolvedValue(createSalon());

    const result = await salonService.create(createOwnerPayload(), {
      name: '  Ustura Barber  ',
      address: '  Istanbul Street 10  ',
      city: '  Istanbul  ',
      district: '  Besiktas  ',
      photoUrl: 'https://example.com/salon.jpg',
      workingHours: {
        monday: { open: '09:00', close: '19:00' },
        saturday: { open: '10:00', close: '18:00' },
      },
    });

    expect(salonRepository.create).toHaveBeenCalledWith(
      {
        ownerId: 'owner-1',
        name: 'Ustura Barber',
        address: 'Istanbul Street 10',
        city: 'Istanbul',
        district: 'Besiktas',
        photoUrl: 'https://example.com/salon.jpg',
        workingHours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: { open: '10:00', close: '18:00' },
          sunday: null,
        },
      },
      undefined,
    );
    expect(result).toEqual({
      id: 'salon-1',
      name: 'Ustura Barber',
      address: 'Istanbul Street 10',
      city: 'Istanbul',
      district: 'Besiktas',
      photoUrl: 'https://example.com/photo.jpg',
      workingHours: createSalon().workingHours,
      isActive: true,
      createdAt: new Date('2026-04-08T00:00:00.000Z'),
      updatedAt: new Date('2026-04-08T00:00:00.000Z'),
    });
  });

  it('rejects working hours entries with unsupported nested keys', async () => {
    let capturedError: unknown;

    try {
      await salonService.create(createOwnerPayload(), {
        name: 'Ustura Barber',
        address: 'Istanbul Street 10',
        city: 'Istanbul',
        photoUrl: '  ',
        workingHours: {
          monday: {
            open: '09:00',
            close: '19:00',
            note: 'extra',
          },
        },
      } as never);
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(BadRequestException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.SALON.INVALID_WORKING_HOURS,
    );
  });

  it('rejects field updates on inactive salons until they are reactivated', async () => {
    salonRepository.findById.mockResolvedValue(
      createSalon({
        isActive: false,
      }),
    );

    let capturedError: unknown;

    try {
      await salonService.update(createOwnerPayload(), 'salon-1', {
        city: 'Ankara',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(BadRequestException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.SALON.INACTIVE_UPDATE_FORBIDDEN,
    );
    expect(salonRepository.update).not.toHaveBeenCalled();
  });

  it('allows owners to reactivate inactive salons without changing other fields', async () => {
    salonRepository.findById.mockResolvedValue(
      createSalon({
        isActive: false,
      }),
    );
    salonRepository.update.mockResolvedValue(createSalon());

    const result = await salonService.update(createOwnerPayload(), 'salon-1', {
      isActive: true,
    });

    expect(salonRepository.update).toHaveBeenCalledWith('salon-1', {
      isActive: true,
    });
    expect(result.isActive).toBe(true);
  });

  it('rejects access when the owner tries to update a salon they do not own', async () => {
    salonRepository.findById.mockResolvedValue(
      createSalon({
        ownerId: 'owner-2',
      }),
    );

    let capturedError: unknown;

    try {
      await salonService.update(createOwnerPayload(), 'salon-1', {
        city: 'Ankara',
      });
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(ForbiddenException);
    expect(getExceptionCode(capturedError)).toBe(
      ERROR_CODES.SALON.MANAGEMENT_FORBIDDEN,
    );
  });

  it('hides inactive salons from the public detail endpoint', async () => {
    salonRepository.findById.mockResolvedValue(
      createSalon({
        isActive: false,
      }),
    );

    let capturedError: unknown;

    try {
      await salonService.findById('salon-1');
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeInstanceOf(NotFoundException);
    expect(getExceptionCode(capturedError)).toBe(ERROR_CODES.SALON.NOT_FOUND);
  });
});
