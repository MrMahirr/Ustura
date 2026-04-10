import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../../../shared/auth/role.enum';
import { AppConfigService } from '../../../config/config.service';
import { RedisService } from '../../../redis/redis.service';
import {
  SALON_CATALOG_SERVICE,
  type SalonCatalogServiceContract,
} from '../../salon/interfaces/salon.contracts';
import { StaffService } from '../../staff/staff.service';
import { ReservationRepository } from '../repositories/reservation.repository';
import { GetSlotsQueryDto } from './dto/get-slots-query.dto';
import {
  invalidSlotStartError,
  liveSelectionStaffRequiredError,
  slotHeldByOtherError,
  slotOutsideWorkingHoursError,
  slotSalonNotFoundError,
  slotStaffNotFoundError,
  slotUnavailableError,
} from './slot.errors';
import { AvailableSlot, SlotScope, SlotSelection } from './slot.types';

interface GeneratedSlot {
  start: string;
  end: string;
}

interface ReservationLock {
  key: string;
  token: string;
}

@Injectable()
export class SlotService {
  constructor(
    private readonly configService: AppConfigService,
    @Inject(SALON_CATALOG_SERVICE)
    private readonly salonCatalogService: SalonCatalogServiceContract,
    private readonly staffService: StaffService,
    private readonly reservationRepository: ReservationRepository,
    private readonly redisService: RedisService,
  ) {}

  async getAvailableSlots(
    salonId: string,
    query: GetSlotsQueryDto,
  ): Promise<AvailableSlot[]> {
    const salon = await this.salonCatalogService.findActiveById(salonId);

    if (!salon) {
      throw slotSalonNotFoundError();
    }

    const generatedSlots = this.generateSlots(salon.workingHours, query.date);

    if (generatedSlots.length === 0) {
      return [];
    }

    const { rangeStart, rangeEnd } = this.buildDateRange(query.date);

    if (!query.staff_id) {
      const activeBarbers =
        await this.staffService.findActiveBarbersBySalonId(salonId);

      if (activeBarbers.length === 0) {
        return generatedSlots.map((slot) => ({
          ...slot,
          available: false,
          status: 'reserved',
          heldUntil: null,
          availableStaffIds: [],
        }));
      }

      const reservations =
        await this.reservationRepository.findActiveByStaffIdsAndRange(
          activeBarbers.map((staff) => staff.id),
          rangeStart,
          rangeEnd,
        );
      const reservedKeys = new Set(
        reservations.map(
          (reservation) =>
            `${reservation.staffId}:${reservation.slotStart.toISOString()}`,
        ),
      );

      return generatedSlots.map((slot) => {
        const availableStaffIds = activeBarbers
          .filter(
            (staff) => !reservedKeys.has(`${staff.id}:${slot.start}`),
          )
          .map((staff) => staff.id);

        return {
          ...slot,
          available: availableStaffIds.length > 0,
          status: availableStaffIds.length > 0 ? 'available' : 'reserved',
          heldUntil: null,
          availableStaffIds,
        };
      });
    }

    const staff = await this.staffService.findById(query.staff_id);

    if (
      !staff ||
      !staff.isActive ||
      staff.salonId !== salonId ||
      staff.role !== Role.BARBER
    ) {
      throw slotStaffNotFoundError();
    }

    const reservations =
      await this.reservationRepository.findActiveByStaffIdsAndRange(
        [staff.id],
        rangeStart,
        rangeEnd,
      );
    const reservedStarts = new Set(
      reservations.map((reservation) => reservation.slotStart.toISOString()),
    );
    const selections = await this.getSelectionMap({
      salonId,
      date: query.date,
      staffId: query.staff_id,
    });

    return generatedSlots.map((slot) => {
      const selection = selections.get(slot.start);
      const isReserved = reservedStarts.has(slot.start);
      const heldByOther =
        !!selection &&
        selection.holderId !== query.requester_selection_owner_id;

      return {
        ...slot,
        available: !isReserved && !heldByOther,
        status: isReserved ? 'reserved' : heldByOther ? 'held' : 'available',
        heldUntil: selection?.expiresAt ?? null,
      };
    });
  }

  async assertSlotReservable(input: {
    salonId: string;
    staffId: string;
    slotStart: string;
    requesterSelectionOwnerId?: string;
  }): Promise<{ slotStart: Date; slotEnd: Date; date: string }> {
    const slotStartDate = this.parseIsoDate(input.slotStart);
    const date = this.formatBusinessDate(slotStartDate);
    const availableSlots = await this.getAvailableSlots(input.salonId, {
      date,
      staff_id: input.staffId,
      requester_selection_owner_id: input.requesterSelectionOwnerId,
    });
    const matchingSlot = availableSlots.find(
      (slot) => slot.start === slotStartDate.toISOString(),
    );

    if (!matchingSlot) {
      throw slotOutsideWorkingHoursError();
    }

    if (!matchingSlot.available) {
      throw slotUnavailableError();
    }

    return {
      slotStart: new Date(matchingSlot.start),
      slotEnd: new Date(matchingSlot.end),
      date,
    };
  }

  async acquireReservationLock(
    staffId: string,
    slotStart: string,
  ): Promise<ReservationLock | null> {
    await this.redisService.connect();
    const client = this.redisService.getClient();
    const key = this.getReservationLockKey(staffId, slotStart);
    const token = this.createLockToken();
    const result = await client.set(
      key,
      token,
      'EX',
      this.configService.reservation.slotLockTtlSeconds,
      'NX',
    );

    if (result !== 'OK') {
      return null;
    }

    return { key, token };
  }

  async releaseReservationLock(
    lockKey: string,
    lockToken: string,
  ): Promise<void> {
    await this.redisService.connect();
    const client = this.redisService.getClient();

    await client.eval(
      `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
          return redis.call("DEL", KEYS[1])
        end
        return 0
      `,
      1,
      lockKey,
      lockToken,
    );
  }

  async holdSelection(
    scope: SlotScope,
    slotStart: string,
    holderId: string,
  ): Promise<SlotSelection[]> {
    if (!scope.staffId) {
      throw liveSelectionStaffRequiredError();
    }

    await this.redisService.connect();
    const client = this.redisService.getClient();
    const key = this.getSelectionKey(scope, slotStart);
    const existingSelection = await this.getSelectionByKey(key);

    if (existingSelection && existingSelection.holderId !== holderId) {
      throw slotHeldByOtherError();
    }

    await client.set(
      key,
      JSON.stringify(this.createSelection(slotStart, holderId)),
      'EX',
      this.configService.reservation.slotSelectionTtlSeconds,
    );

    return this.getSelections(scope);
  }

  async releaseSelection(
    scope: SlotScope,
    slotStart: string,
    holderId: string,
  ): Promise<SlotSelection[]> {
    if (!scope.staffId) {
      return [];
    }

    await this.redisService.connect();
    const client = this.redisService.getClient();

    await client.eval(
      `
        local existing = redis.call("GET", KEYS[1])
        if not existing then
          return 0
        end
        local decoded = cjson.decode(existing)
        if decoded["holderId"] == ARGV[1] then
          return redis.call("DEL", KEYS[1])
        end
        return 0
      `,
      1,
      this.getSelectionKey(scope, slotStart),
      holderId,
    );

    return this.getSelections(scope);
  }

  async getSelections(scope: SlotScope): Promise<SlotSelection[]> {
    if (!scope.staffId) {
      return [];
    }

    await this.redisService.connect();
    const client = this.redisService.getClient();
    const keys = await client.keys(this.getSelectionPattern(scope));

    if (keys.length === 0) {
      return [];
    }

    const rawSelections = await client.mget(keys);

    return rawSelections
      .map((value) => this.parseSelection(value))
      .filter((value): value is SlotSelection => value !== null)
      .sort((left, right) => left.slotStart.localeCompare(right.slotStart));
  }

  private async getSelectionMap(
    scope: SlotScope,
  ): Promise<Map<string, SlotSelection>> {
    const selections = await this.getSelections(scope);
    return new Map(
      selections.map((selection) => [selection.slotStart, selection]),
    );
  }

  private async getSelectionByKey(key: string): Promise<SlotSelection | null> {
    await this.redisService.connect();
    const client = this.redisService.getClient();
    return this.parseSelection(await client.get(key));
  }

  private createSelection(slotStart: string, holderId: string): SlotSelection {
    return {
      holderId,
      slotStart,
      expiresAt: new Date(
        Date.now() + this.configService.reservation.slotSelectionTtlSeconds * 1000,
      ).toISOString(),
    };
  }

  private parseSelection(value: string | null): SlotSelection | null {
    if (!value) {
      return null;
    }

    try {
      const parsedValue = JSON.parse(value) as Partial<SlotSelection>;

      if (
        typeof parsedValue.holderId !== 'string' ||
        typeof parsedValue.slotStart !== 'string' ||
        typeof parsedValue.expiresAt !== 'string'
      ) {
        return null;
      }

      return {
        holderId: parsedValue.holderId,
        slotStart: parsedValue.slotStart,
        expiresAt: parsedValue.expiresAt,
      };
    } catch {
      return null;
    }
  }

  private generateSlots(
    workingHours: Record<string, { open: string; close: string } | null>,
    date: string,
  ): GeneratedSlot[] {
    const dayKey = this.getDayKey(date);
    const hours = workingHours[dayKey];

    if (!hours) {
      return [];
    }

    const slots: GeneratedSlot[] = [];
    let cursor = this.parseBusinessDateTime(date, hours.open);
    const closeTime = this.parseBusinessDateTime(date, hours.close);

    while (
      cursor.getTime() +
        this.configService.reservation.slotDurationMinutes * 60_000 <=
      closeTime.getTime()
    ) {
      const nextCursor = new Date(
        cursor.getTime() +
          this.configService.reservation.slotDurationMinutes * 60_000,
      );

      slots.push({
        start: cursor.toISOString(),
        end: nextCursor.toISOString(),
      });

      cursor = nextCursor;
    }

    return slots;
  }

  private parseBusinessDateTime(date: string, time: string): Date {
    return new Date(
      `${date}T${time}:00${this.configService.reservation.businessUtcOffset}`,
    );
  }

  private parseIsoDate(value: string): Date {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      throw invalidSlotStartError();
    }

    return parsedDate;
  }

  private buildDateRange(date: string): { rangeStart: Date; rangeEnd: Date } {
    const rangeStart = new Date(
      `${date}T00:00:00${this.configService.reservation.businessUtcOffset}`,
    );
    const rangeEnd = new Date(rangeStart.getTime() + 24 * 60 * 60 * 1000);

    return { rangeStart, rangeEnd };
  }

  private formatBusinessDate(date: Date): string {
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: this.configService.reservation.businessTimeZone,
    }).format(date);
  }

  private getDayKey(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: this.configService.reservation.businessTimeZone,
    })
      .format(
        new Date(
          `${date}T00:00:00${this.configService.reservation.businessUtcOffset}`,
        ),
      )
      .toLowerCase();
  }

  private getSelectionKey(scope: SlotScope, slotStart: string): string {
    return `slot-selection:${scope.salonId}:${scope.date}:${scope.staffId}:${slotStart}`;
  }

  private getSelectionPattern(scope: SlotScope): string {
    return `slot-selection:${scope.salonId}:${scope.date}:${scope.staffId}:*`;
  }

  private getReservationLockKey(staffId: string, slotStart: string): string {
    return `slot-lock:${staffId}:${slotStart}`;
  }

  private createLockToken(): string {
    return `${Date.now()}:${Math.random().toString(36).slice(2)}`;
  }
}
