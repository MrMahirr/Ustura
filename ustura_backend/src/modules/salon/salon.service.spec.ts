import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { Salon } from './interfaces/salon.types';
import { SalonRepository } from './repositories/salon.repository';
import { SalonService } from './salon.service';

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

describe('SalonService', () => {
  let salonService: SalonService;
  let salonRepository: jest.Mocked<SalonRepository>;

  beforeEach(() => {
    salonRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
    } as unknown as jest.Mocked<SalonRepository>;

    salonService = new SalonService(salonRepository);
  });

  it('creates a salon with normalized string fields and full working hours map', async () => {
    const createdSalon = createSalon();
    salonRepository.create.mockResolvedValue(createdSalon);

    const result = await salonService.create(createOwnerPayload(), {
      name: '  Ustura Barber  ',
      address: '  Istanbul Street 10  ',
      city: '  Istanbul  ',
      district: '  Besiktas  ',
      photo_url: 'https://example.com/photo.jpg',
      working_hours: {
        monday: { open: '09:00', close: '19:00' },
        saturday: { open: '10:00', close: '18:00' },
      },
    });

    expect(salonRepository.create).toHaveBeenCalledWith({
      ownerId: 'owner-1',
      name: 'Ustura Barber',
      address: 'Istanbul Street 10',
      city: 'Istanbul',
      district: 'Besiktas',
      photoUrl: 'https://example.com/photo.jpg',
      workingHours: {
        monday: { open: '09:00', close: '19:00' },
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: { open: '10:00', close: '18:00' },
        sunday: null,
      },
    });
    expect(result).toBe(createdSalon);
  });

  it('rejects working hours shorter than one slot', async () => {
    await expect(
      salonService.create(createOwnerPayload(), {
        name: 'Ustura Barber',
        address: 'Istanbul Street 10',
        city: 'Istanbul',
        working_hours: {
          monday: { open: '09:00', close: '09:15' },
        },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects access when the owner tries to update a salon they do not own', async () => {
    salonRepository.findById.mockResolvedValue(
      createSalon({
        ownerId: 'owner-2',
      }),
    );

    await expect(
      salonService.update(createOwnerPayload(), 'salon-1', {
        city: 'Ankara',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('hides inactive salons from the public detail endpoint', async () => {
    salonRepository.findById.mockResolvedValue(
      createSalon({
        isActive: false,
      }),
    );

    await expect(salonService.findById('salon-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
