import { Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { AppConfigService } from '../../config/config.service';
import type { SqlQueryExecutor } from '../../database/database.types';
import { CreateSalonDto } from './dto/create-salon.dto';
import { FindSalonsQueryDto } from './dto/find-salons-query.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import {
  salonInvalidFieldError,
  salonInvalidWorkingHoursError,
  salonNotFoundError,
} from './errors/salon.errors';
import {
  CreateOwnedSalonDraft,
  CreateSalonInput,
  Salon,
  UpdateSalonInput,
  WorkingHours,
  WorkingHoursEntry,
} from './interfaces/salon.types';
import { SalonPolicy } from './policies/salon.policy';
import { SalonRepository } from './repositories/salon.repository';

const WEEK_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

@Injectable()
export class SalonService {
  constructor(
    private readonly configService: AppConfigService,
    private readonly salonRepository: SalonRepository,
    private readonly salonPolicy: SalonPolicy,
  ) {}

  async findAll(query: FindSalonsQueryDto): Promise<Salon[]> {
    return this.salonRepository.findAll({
      city: this.normalizeOptionalString(query.city),
      search: this.normalizeOptionalString(query.search),
    });
  }

  async findOwned(currentUser: JwtPayload): Promise<Salon[]> {
    this.salonPolicy.assertCanManage(currentUser);
    return this.salonRepository.findByOwnerId(currentUser.sub);
  }

  async findById(id: string): Promise<Salon> {
    const salon = await this.salonRepository.findById(id);

    if (!salon?.isActive) {
      throw salonNotFoundError();
    }

    return salon;
  }

  async findActiveById(id: string): Promise<Salon | null> {
    const salon = await this.salonRepository.findById(id);

    if (!salon?.isActive) {
      return null;
    }

    return salon;
  }

  async create(
    currentUser: JwtPayload,
    createSalonDto: CreateSalonDto,
  ): Promise<Salon> {
    this.salonPolicy.assertCanManage(currentUser);

    return this.createOwnedSalon(currentUser.sub, {
      name: createSalonDto.name,
      address: createSalonDto.address,
      city: createSalonDto.city,
      district: createSalonDto.district,
      photoUrl: createSalonDto.photo_url,
      workingHours: createSalonDto.working_hours,
    });
  }

  prepareOwnedSalonInput(
    input: CreateOwnedSalonDraft,
  ): Omit<CreateSalonInput, 'ownerId'> {
    return {
      name: this.normalizeRequiredString(input.name, 'name'),
      address: this.normalizeRequiredString(input.address, 'address'),
      city: this.normalizeRequiredString(input.city, 'city'),
      district: this.normalizeOptionalString(input.district) ?? null,
      photoUrl: this.normalizeOptionalString(input.photoUrl) ?? null,
      workingHours: this.normalizeWorkingHours(input.workingHours, {
        requireAtLeastOneOpenDay: true,
      }),
    };
  }

  async createOwnedSalon(
    ownerId: string,
    input: CreateOwnedSalonDraft,
    executor?: SqlQueryExecutor,
  ): Promise<Salon> {
    return this.salonRepository.create(
      {
        ownerId,
        ...this.prepareOwnedSalonInput(input),
      },
      executor,
    );
  }

  async update(
    currentUser: JwtPayload,
    salonId: string,
    updateSalonDto: UpdateSalonDto,
  ): Promise<Salon> {
    const existingSalon = await this.requireOwnedSalon(currentUser, salonId);

    const updateInput: UpdateSalonInput = {
      ...(updateSalonDto.name !== undefined
        ? {
            name: this.normalizeRequiredString(updateSalonDto.name, 'name'),
          }
        : {}),
      ...(updateSalonDto.address !== undefined
        ? {
            address: this.normalizeRequiredString(
              updateSalonDto.address,
              'address',
            ),
          }
        : {}),
      ...(updateSalonDto.city !== undefined
        ? {
            city: this.normalizeRequiredString(updateSalonDto.city, 'city'),
          }
        : {}),
      ...(updateSalonDto.district !== undefined
        ? {
            district: this.normalizeOptionalString(updateSalonDto.district) ?? null,
          }
        : {}),
      ...(updateSalonDto.photo_url !== undefined
        ? {
            photoUrl: this.normalizeOptionalString(updateSalonDto.photo_url) ?? null,
          }
        : {}),
      ...(updateSalonDto.working_hours !== undefined
        ? {
            workingHours: this.normalizeWorkingHours(updateSalonDto.working_hours, {
              base: existingSalon.workingHours,
              requireAtLeastOneOpenDay: true,
            }),
          }
        : {}),
      ...(updateSalonDto.is_active !== undefined
        ? {
            isActive: updateSalonDto.is_active,
          }
        : {}),
    };

    const updatedSalon = await this.salonRepository.update(salonId, updateInput);

    if (!updatedSalon) {
      throw salonNotFoundError();
    }

    return updatedSalon;
  }

  async remove(currentUser: JwtPayload, salonId: string): Promise<Salon> {
    await this.requireOwnedSalon(currentUser, salonId);

    const salon = await this.salonRepository.deactivate(salonId);

    if (!salon) {
      throw salonNotFoundError();
    }

    return salon;
  }

  private async requireOwnedSalon(
    currentUser: JwtPayload,
    salonId: string,
  ): Promise<Salon> {
    const salon = await this.salonRepository.findById(salonId);

    if (!salon) {
      throw salonNotFoundError();
    }

    this.salonPolicy.assertCanManageSalon(currentUser, salon);
    return salon;
  }

  private normalizeWorkingHours(
    input: Record<string, unknown>,
    options: {
      base?: WorkingHours;
      requireAtLeastOneOpenDay: boolean;
    },
  ): WorkingHours {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      throw salonInvalidWorkingHoursError('working_hours must be an object.');
    }

    const nextWorkingHours: WorkingHours = {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
      ...(options.base ?? {}),
    };

    for (const [rawKey, rawValue] of Object.entries(input)) {
      const day = rawKey.trim().toLowerCase();

      if (!WEEK_DAYS.includes(day as (typeof WEEK_DAYS)[number])) {
        throw salonInvalidWorkingHoursError(
          `working_hours contains unsupported day key: ${rawKey}.`,
        );
      }

      nextWorkingHours[day] = this.normalizeWorkingHoursEntry(day, rawValue);
    }

    if (
      options.requireAtLeastOneOpenDay &&
      WEEK_DAYS.every((day) => nextWorkingHours[day] === null)
    ) {
      throw salonInvalidWorkingHoursError(
        'working_hours must contain at least one open day.',
      );
    }

    return nextWorkingHours;
  }

  private normalizeWorkingHoursEntry(
    day: string,
    value: unknown,
  ): WorkingHoursEntry | null {
    if (value === null) {
      return null;
    }

    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw salonInvalidWorkingHoursError(
        `working_hours.${day} must be null or an object with open/close.`,
      );
    }

    const open = this.readTimeField(value, 'open', day);
    const close = this.readTimeField(value, 'close', day);

    if (open >= close) {
      throw salonInvalidWorkingHoursError(
        `working_hours.${day} close must be after open.`,
      );
    }

    if (
      this.toMinuteValue(close) - this.toMinuteValue(open) <
      this.configService.reservation.slotDurationMinutes
    ) {
      throw salonInvalidWorkingHoursError(
        `working_hours.${day} must span at least ${this.configService.reservation.slotDurationMinutes} minutes.`,
      );
    }

    return {
      open,
      close,
    };
  }

  private readTimeField(
    value: object,
    fieldName: 'open' | 'close',
    day: string,
  ): string {
    const fieldValue = Reflect.get(value, fieldName);

    if (typeof fieldValue !== 'string' || !TIME_PATTERN.test(fieldValue)) {
      throw salonInvalidWorkingHoursError(
        `working_hours.${day}.${fieldName} must be in HH:MM format.`,
      );
    }

    return fieldValue;
  }

  private toMinuteValue(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private normalizeRequiredString(value: string, fieldName: string): string {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      throw salonInvalidFieldError(fieldName);
    }

    return normalizedValue;
  }

  private normalizeOptionalString(value?: string | null): string | undefined {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
  }
}
