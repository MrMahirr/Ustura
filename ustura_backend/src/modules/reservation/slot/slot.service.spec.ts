import { HttpException } from '@nestjs/common';
import { ERROR_CODES } from '../../../shared/errors/error-codes';
import { Role } from '../../../shared/auth/role.enum';
import type { AppConfigService } from '../../../config/config.service';
import { RedisService, RedisClientLike } from '../../../redis/redis.service';
import type { SalonCatalogServiceContract } from '../../salon/interfaces/salon.contracts';
import type { StaffService } from '../../staff/staff.service';
import type { ReservationRepository } from '../repositories/reservation.repository';
import { SlotService } from './slot.service';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function createConfigService(): AppConfigService {
  return {
    reservation: {
      slotDurationMinutes: 30,
      slotSelectionTtlSeconds: 45,
      slotLockTtlSeconds: 5,
      businessUtcOffset: '+03:00',
      businessTimeZone: 'Europe/Istanbul',
    },
  } as AppConfigService;
}

function createSalonCatalogService(): jest.Mocked<
  Pick<SalonCatalogServiceContract, 'findActiveById'>
> {
  return {
    findActiveById: jest.fn(),
  };
}

function createStaffService(): jest.Mocked<
  Pick<StaffService, 'findById' | 'findActiveBarbersBySalonId'>
> {
  return {
    findById: jest.fn(),
    findActiveBarbersBySalonId: jest.fn(),
  };
}

function createReservationRepository(): jest.Mocked<
  Pick<ReservationRepository, 'findActiveByStaffIdsAndRange'>
> {
  return {
    findActiveByStaffIdsAndRange: jest.fn().mockResolvedValue([]),
  };
}

/**
 * Lightweight in-memory Redis client matching `RedisClientLike`.
 * Reproduces `SET ... NX` atomicity and the Lua DEL-if-match script
 * so that concurrency semantics can be verified without a network
 * connection.
 */
class InProcessRedisClient implements RedisClientLike {
  private readonly store = new Map<
    string,
    { value: string; expiresAt: number | null }
  >();

  async ping(): Promise<string> {
    return 'PONG';
  }

  async set(
    key: string,
    value: string,
    mode?: 'EX',
    durationSeconds?: number,
    condition?: 'NX',
  ): Promise<string | null> {
    this.purgeExpired(key);

    if (condition === 'NX' && this.store.has(key)) {
      return null;
    }

    const expiresAt =
      mode === 'EX' && durationSeconds !== undefined
        ? Date.now() + durationSeconds * 1000
        : null;

    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async get(key: string): Promise<string | null> {
    this.purgeExpired(key);
    return this.store.get(key)?.value ?? null;
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return Promise.all(keys.map((k) => this.get(k)));
  }

  async keys(pattern: string): Promise<string[]> {
    this.purgeAll();
    const regex = new RegExp(
      `^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*')}$`,
    );
    return [...this.store.keys()].filter((k) => regex.test(k));
  }

  async eval(
    script: string,
    numberOfKeys: number,
    ...args: string[]
  ): Promise<number> {
    const keys = args.slice(0, numberOfKeys);
    const values = args.slice(numberOfKeys);
    const key = keys[0];
    const expectedValue = values[0];

    if (!key || expectedValue === undefined) {
      return 0;
    }

    const currentValue = await this.get(key);

    if (!currentValue) {
      return 0;
    }

    if (script.includes('cjson.decode')) {
      try {
        const parsed = JSON.parse(currentValue) as { holderId?: string };
        if (parsed.holderId !== expectedValue) {
          return 0;
        }
      } catch {
        return 0;
      }
    } else if (currentValue !== expectedValue) {
      return 0;
    }

    this.store.delete(key);
    return 1;
  }

  async quit(): Promise<void> {
    this.store.clear();
  }

  /** Simulate TTL expiry by advancing the clock past the stored expiresAt. */
  expireKey(key: string): void {
    const entry = this.store.get(key);
    if (entry) {
      entry.expiresAt = Date.now() - 1;
    }
  }

  private purgeExpired(key: string): void {
    const entry = this.store.get(key);
    if (entry && entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
    }
  }

  private purgeAll(): void {
    for (const key of this.store.keys()) {
      this.purgeExpired(key);
    }
  }
}

function createRedisService(client: InProcessRedisClient): RedisService {
  return {
    connect: jest.fn().mockResolvedValue(undefined),
    getClient: () => client,
  } as unknown as RedisService;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SlotService – Concurrency & Lock Safety', () => {
  let slotService: SlotService;
  let redisClient: InProcessRedisClient;
  let salonCatalogService: ReturnType<typeof createSalonCatalogService>;
  let staffService: ReturnType<typeof createStaffService>;
  let reservationRepository: ReturnType<typeof createReservationRepository>;

  beforeEach(() => {
    redisClient = new InProcessRedisClient();
    salonCatalogService = createSalonCatalogService();
    staffService = createStaffService();
    reservationRepository = createReservationRepository();

    slotService = new SlotService(
      createConfigService(),
      salonCatalogService as unknown as SalonCatalogServiceContract,
      staffService as unknown as StaffService,
      reservationRepository as unknown as ReservationRepository,
      createRedisService(redisClient),
    );
  });

  // -----------------------------------------------------------------------
  // acquireReservationLock – NX race condition
  // -----------------------------------------------------------------------

  describe('acquireReservationLock', () => {
    it('grants a lock to the first caller', async () => {
      const lock = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );

      expect(lock).not.toBeNull();
      expect(lock!.key).toContain('staff-1');
      expect(lock!.token).toBeDefined();
    });

    it('rejects a second concurrent caller for the same slot', async () => {
      const firstLock = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );
      const secondLock = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );

      expect(firstLock).not.toBeNull();
      expect(secondLock).toBeNull();
    });

    it('allows locks on different staff+slot combinations simultaneously', async () => {
      const lockA = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );
      const lockB = await slotService.acquireReservationLock(
        'staff-2',
        '2026-04-10T10:00:00.000Z',
      );
      const lockC = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:30:00.000Z',
      );

      expect(lockA).not.toBeNull();
      expect(lockB).not.toBeNull();
      expect(lockC).not.toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // releaseReservationLock – token ownership
  // -----------------------------------------------------------------------

  describe('releaseReservationLock', () => {
    it('releases the lock when the correct token is provided', async () => {
      const lock = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );

      expect(lock).not.toBeNull();

      await slotService.releaseReservationLock(lock!.key, lock!.token);

      const secondLock = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );

      expect(secondLock).not.toBeNull();
    });

    it('does not release the lock when a wrong token is provided', async () => {
      const lock = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );

      expect(lock).not.toBeNull();

      await slotService.releaseReservationLock(lock!.key, 'wrong-token');

      const secondLock = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );

      expect(secondLock).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Lock TTL expiry
  // -----------------------------------------------------------------------

  describe('lock TTL behaviour', () => {
    it('allows a new lock after the previous lock TTL expires', async () => {
      const firstLock = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );

      expect(firstLock).not.toBeNull();

      // Simulate TTL expiry
      redisClient.expireKey(firstLock!.key);

      const secondLock = await slotService.acquireReservationLock(
        'staff-1',
        '2026-04-10T10:00:00.000Z',
      );

      expect(secondLock).not.toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // holdSelection – conflict & ownership
  // -----------------------------------------------------------------------

  describe('holdSelection', () => {
    const scope = {
      salonId: 'salon-1',
      date: '2026-04-10',
      staffId: 'staff-1',
    };
    const slotStart = '2026-04-10T10:00:00.000Z';

    it('allows the first holder to select a slot', async () => {
      const selections = await slotService.holdSelection(
        scope,
        slotStart,
        'holder-A',
      );

      expect(selections.length).toBeGreaterThanOrEqual(1);
      expect(selections.some((s) => s.holderId === 'holder-A')).toBe(true);
    });

    it('rejects a different holder from selecting the same slot', async () => {
      await slotService.holdSelection(scope, slotStart, 'holder-A');

      let capturedError: unknown;

      try {
        await slotService.holdSelection(scope, slotStart, 'holder-B');
      } catch (error) {
        capturedError = error;
      }

      expect(capturedError).toBeDefined();
      expect(getExceptionCode(capturedError)).toBe(
        ERROR_CODES.SLOT.SLOT_HELD_BY_OTHER,
      );
    });

    it('allows the same holder to refresh their selection', async () => {
      await slotService.holdSelection(scope, slotStart, 'holder-A');

      const selections = await slotService.holdSelection(
        scope,
        slotStart,
        'holder-A',
      );

      expect(selections.some((s) => s.holderId === 'holder-A')).toBe(true);
    });

    it('requires staffId for live selection', async () => {
      const noStaffScope = {
        salonId: 'salon-1',
        date: '2026-04-10',
        staffId: undefined as unknown as string,
      };

      let capturedError: unknown;

      try {
        await slotService.holdSelection(noStaffScope, slotStart, 'holder-A');
      } catch (error) {
        capturedError = error;
      }

      expect(capturedError).toBeDefined();
      expect(getExceptionCode(capturedError)).toBe(
        ERROR_CODES.SLOT.LIVE_SELECTION_STAFF_REQUIRED,
      );
    });
  });

  // -----------------------------------------------------------------------
  // releaseSelection – ownership guard
  // -----------------------------------------------------------------------

  describe('releaseSelection', () => {
    const scope = {
      salonId: 'salon-1',
      date: '2026-04-10',
      staffId: 'staff-1',
    };
    const slotStart = '2026-04-10T10:00:00.000Z';

    it('releases the selection when the correct holder requests it', async () => {
      await slotService.holdSelection(scope, slotStart, 'holder-A');

      const selectionsAfterRelease = await slotService.releaseSelection(
        scope,
        slotStart,
        'holder-A',
      );

      const stillHeld = selectionsAfterRelease.some(
        (s) => s.slotStart === slotStart && s.holderId === 'holder-A',
      );

      expect(stillHeld).toBe(false);
    });

    it('does not release the selection when a different holder requests it', async () => {
      await slotService.holdSelection(scope, slotStart, 'holder-A');

      await slotService.releaseSelection(scope, slotStart, 'holder-B');

      const selections = await slotService.getSelections(scope);
      const stillHeld = selections.some(
        (s) => s.slotStart === slotStart && s.holderId === 'holder-A',
      );

      expect(stillHeld).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Selection TTL expiry
  // -----------------------------------------------------------------------

  describe('selection TTL behaviour', () => {
    const scope = {
      salonId: 'salon-1',
      date: '2026-04-10',
      staffId: 'staff-1',
    };
    const slotStart = '2026-04-10T10:00:00.000Z';

    it('removes a selection after its TTL expires', async () => {
      await slotService.holdSelection(scope, slotStart, 'holder-A');

      // Simulate TTL expiry for the selection key
      const selectionKey = `slot-selection:${scope.salonId}:${scope.date}:${scope.staffId}:${slotStart}`;
      redisClient.expireKey(selectionKey);

      const selections = await slotService.getSelections(scope);
      const stillHeld = selections.some(
        (s) => s.slotStart === slotStart && s.holderId === 'holder-A',
      );

      expect(stillHeld).toBe(false);
    });

    it('allows a different holder to select the slot after the original TTL expires', async () => {
      await slotService.holdSelection(scope, slotStart, 'holder-A');

      const selectionKey = `slot-selection:${scope.salonId}:${scope.date}:${scope.staffId}:${slotStart}`;
      redisClient.expireKey(selectionKey);

      const selections = await slotService.holdSelection(
        scope,
        slotStart,
        'holder-B',
      );

      expect(selections.some((s) => s.holderId === 'holder-B')).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // assertSlotReservable – availability & held detection
  // -----------------------------------------------------------------------

  describe('assertSlotReservable', () => {
    beforeEach(() => {
      salonCatalogService.findActiveById.mockResolvedValue({
        id: 'salon-1',
        ownerId: 'owner-1',
        name: 'Test Salon',
        isActive: true,
        workingHours: {
          thursday: { open: '09:00', close: '18:00' },
        },
      } as any);
      staffService.findById.mockResolvedValue({
        id: 'staff-1',
        salonId: 'salon-1',
        role: Role.BARBER,
        isActive: true,
      } as any);
      reservationRepository.findActiveByStaffIdsAndRange.mockResolvedValue([]);
    });

    it('returns the slot when it is available', async () => {
      const result = await slotService.assertSlotReservable({
        salonId: 'salon-1',
        staffId: 'staff-1',
        slotStart: '2026-04-09T06:00:00.000Z', // 09:00 TR time on Thursday
      });

      expect(result.slotStart).toBeInstanceOf(Date);
      expect(result.slotEnd).toBeInstanceOf(Date);
      expect(result.date).toBeDefined();
    });

    it('rejects a slot that is already reserved', async () => {
      reservationRepository.findActiveByStaffIdsAndRange.mockResolvedValue([
        {
          staffId: 'staff-1',
          slotStart: new Date('2026-04-09T06:00:00.000Z'),
        },
      ] as any);

      let capturedError: unknown;

      try {
        await slotService.assertSlotReservable({
          salonId: 'salon-1',
          staffId: 'staff-1',
          slotStart: '2026-04-09T06:00:00.000Z',
        });
      } catch (error) {
        capturedError = error;
      }

      expect(capturedError).toBeDefined();
      expect(getExceptionCode(capturedError)).toBe(
        ERROR_CODES.SLOT.SLOT_UNAVAILABLE,
      );
    });

    it('rejects a slot held by another visitor when no selection owner is provided', async () => {
      const scope = {
        salonId: 'salon-1',
        date: '2026-04-09',
        staffId: 'staff-1',
      };

      await slotService.holdSelection(
        scope,
        '2026-04-09T06:00:00.000Z',
        'other-visitor',
      );

      let capturedError: unknown;

      try {
        await slotService.assertSlotReservable({
          salonId: 'salon-1',
          staffId: 'staff-1',
          slotStart: '2026-04-09T06:00:00.000Z',
        });
      } catch (error) {
        capturedError = error;
      }

      expect(capturedError).toBeDefined();
      expect(getExceptionCode(capturedError)).toBe(
        ERROR_CODES.SLOT.SLOT_UNAVAILABLE,
      );
    });
  });
});
