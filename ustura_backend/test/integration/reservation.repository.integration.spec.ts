import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '../../src/config/config.module';
import { DatabaseModule } from '../../src/database/database.module';
import { DatabaseService } from '../../src/database/database.service';
import { ReservationRepository } from '../../src/modules/reservation/repositories/reservation.repository';
import { StaffRepository } from '../../src/modules/staff/repositories/staff.repository';
import { SalonRepository } from '../../src/modules/salon/repositories/salon.repository';
import { createContractTestApp } from '../helpers/create-contract-test-app';
import { Role } from '../../src/shared/auth/role.enum';
import { ReservationStatus } from '../../src/modules/reservation/enums/reservation-status.enum';

describe('ReservationRepository (Integration)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let reservationRepository: ReservationRepository;
  let staffRepository: StaffRepository;
  let salonRepository: SalonRepository;

  let ownerId: string;
  let customerId: string;
  let staffUserId: string;
  let salonId: string;
  let staffId: string;

  beforeAll(async () => {
    app = await createContractTestApp({
      imports: [ConfigModule, DatabaseModule],
      providers: [ReservationRepository, StaffRepository, SalonRepository],
    });
    databaseService = app.get(DatabaseService);
    reservationRepository = app.get(ReservationRepository);
    staffRepository = app.get(StaffRepository);
    salonRepository = app.get(SalonRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await databaseService.query({ text: 'DELETE FROM refresh_tokens' });
    await databaseService.query({ text: 'DELETE FROM owner_applications' });
    await databaseService.query({ text: 'DELETE FROM reservations' });
    await databaseService.query({ text: 'DELETE FROM staff' });
    await databaseService.query({ text: 'DELETE FROM salons' });
    await databaseService.query({ text: 'DELETE FROM users' });

    let result = await databaseService.query({
      text: `INSERT INTO users (name, email, phone, role) VALUES ('Owner', 'owner3@test.com', '122', 'owner') RETURNING id`,
    });
    ownerId = result.rows[0].id;

    result = await databaseService.query({
      text: `INSERT INTO users (name, email, phone, role) VALUES ('Customer', 'cust@test.com', '123', 'customer') RETURNING id`,
    });
    customerId = result.rows[0].id;

    result = await databaseService.query({
      text: `INSERT INTO users (name, email, phone, role) VALUES ('Staff 2', 'staff2@test.com', '124', 'barber') RETURNING id`,
    });
    staffUserId = result.rows[0].id;

    const salon = await salonRepository.create({
      ownerId,
      name: 'Test Salon Res',
      address: 'Addr',
      city: 'Istanbul',
      photoUrl: null,
      district: null,
      workingHours: { monday: { open: '09:00', close: '18:00' } },
    });
    salonId = salon.id;

    const staff = await staffRepository.create({
      userId: staffUserId,
      salonId,
      role: Role.BARBER,
    });
    staffId = staff.id;
  });

  it('crud operations working via real database connection', async () => {
    const slotStart = new Date('2026-05-10T10:00:00Z');
    const slotEnd = new Date('2026-05-10T10:30:00Z');

    const created = await reservationRepository.create({
      customerId,
      salonId,
      staffId,
      slotStart,
      slotEnd,
      status: ReservationStatus.PENDING,
      notes: 'Haircut',
    });

    expect(created.id).toBeDefined();
    expect(created.status).toBe(ReservationStatus.PENDING);
    expect(created.slotStart).toEqual(slotStart);

    let activeReservations = await reservationRepository.findActiveByStaffIdsAndRange(
      [staffId],
      new Date('2026-05-10T00:00:00Z'),
      new Date('2026-05-11T00:00:00Z'),
    );
    expect(activeReservations).toHaveLength(1);

    const updated = await reservationRepository.updateStatus(
      created.id,
      ReservationStatus.CONFIRMED,
      ownerId,
    );
    expect(updated?.status).toBe(ReservationStatus.CONFIRMED);
    expect(updated?.statusChangedByUserId).toBe(ownerId);

    const cancelled = await reservationRepository.cancel(created.id, customerId);
    expect(cancelled?.status).toBe(ReservationStatus.CANCELLED);
    expect(cancelled?.cancelledByUserId).toBe(customerId);

    activeReservations = await reservationRepository.findActiveByStaffIdsAndRange(
        [staffId],
        new Date('2026-05-10T00:00:00Z'),
        new Date('2026-05-11T00:00:00Z'),
    );
    expect(activeReservations).toHaveLength(0);
  });
});
