import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/config.service';
import { salonInvalidWorkingHoursError } from './errors/salon.errors';
import {
  SALON_DAY_KEYS,
  type SalonDayKey,
  type WorkingHours,
  type WorkingHoursEntry,
} from './interfaces/salon.types';

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

@Injectable()
export class SalonWorkingHoursService {
  constructor(private readonly configService: AppConfigService) {}

  normalize(
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

      if (!SALON_DAY_KEYS.includes(day as SalonDayKey)) {
        throw salonInvalidWorkingHoursError(
          `working_hours contains unsupported day key: ${rawKey}.`,
        );
      }

      nextWorkingHours[day as SalonDayKey] = this.normalizeEntry(
        day as SalonDayKey,
        rawValue,
      );
    }

    if (
      options.requireAtLeastOneOpenDay &&
      SALON_DAY_KEYS.every((day) => nextWorkingHours[day] === null)
    ) {
      throw salonInvalidWorkingHoursError(
        'working_hours must contain at least one open day.',
      );
    }

    return nextWorkingHours;
  }

  private normalizeEntry(
    day: SalonDayKey,
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

    const entryKeys = Object.keys(value).sort();

    if (
      entryKeys.length !== 2 ||
      entryKeys[0] !== 'close' ||
      entryKeys[1] !== 'open'
    ) {
      throw salonInvalidWorkingHoursError(
        `working_hours.${day} must only contain open and close fields.`,
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
    day: SalonDayKey,
  ): string {
    const fieldValue: unknown = Reflect.get(value, fieldName);

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
}
