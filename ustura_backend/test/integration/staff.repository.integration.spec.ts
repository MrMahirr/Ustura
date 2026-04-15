import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '../../src/config/config.module';
import { DatabaseModule } from '../../src/database/database.module';
import { DatabaseService } from '../../src/database/database.service';
import { StaffRepository } from '../../src/modules/staff/repositories/staff.repository';
import { SalonRepository } from '../../src/modules/salon/repositories/salon.repository';
import { createContractTestApp } from '../helpers/create-contract-test-app';
import { Role } from '../../src/shared/auth/role.enum';

describe('StaffRepository (Integration)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let staffRepository: StaffRepository;
  let salonRepository: SalonRepository;

  let ownerId: string;
  let salonId: string;
  let staffUserId: string;

  beforeAll(async () => {
    app = await createContractTestApp({
      imports: [ConfigModule, DatabaseModule],
      providers: [StaffRepository, SalonRepository],
    });
    databaseService = app.get(DatabaseService);
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
      text: `INSERT INTO users (name, email, phone, role) VALUES ('Owner', 'owner2@test.com', '112', 'owner') RETURNING id`,
    });
    ownerId = result.rows[0].id;

    result = await databaseService.query({
      text: `INSERT INTO users (name, email, phone, role) VALUES ('Staff 1', 'staff1@test.com', '113', 'barber') RETURNING id`,
    });
    staffUserId = result.rows[0].id;

    const salon = await salonRepository.create({
      ownerId,
      name: 'Test Salon for Staff',
      address: 'Test Addr',
      city: 'Istanbul',
      photoUrl: null,
      district: null,
      workingHours: { monday: { open: '09:00', close: '18:00' } },
    });
    salonId = salon.id;
  });

  it('crud operations working via real database connection', async () => {
    const created = await staffRepository.create({
      userId: staffUserId,
      salonId,
      role: Role.BARBER,
      bio: 'Expert',
    });

    expect(created.id).toBeDefined();
    expect(created.role).toBe(Role.BARBER);
    expect(created.isActive).toBe(true);

    const foundById = await staffRepository.findById(created.id);
    expect(foundById?.displayName).toBe('Staff 1');

    const updated = await staffRepository.update(created.id, {
      bio: 'Master',
    });
    expect(updated?.bio).toBe('Master');

    let salonStaff = await staffRepository.findBySalonId(salonId);
    expect(salonStaff).toHaveLength(1);

    salonStaff = await staffRepository.findActiveBarbersBySalonId(salonId);
    expect(salonStaff).toHaveLength(1);

    const check1 = await staffRepository.findActiveByUserIdAndSalon(
      staffUserId,
      salonId,
    );
    expect(check1?.id).toBe(created.id);

    const deactivated = await staffRepository.deactivate(created.id);
    expect(deactivated?.isActive).toBe(false);

    salonStaff = await staffRepository.findActiveBarbersBySalonId(salonId);
    expect(salonStaff).toHaveLength(0);
  });

  it('find returns null for non existing staff', async () => {
    const found = await staffRepository.findById(
      '00000000-0000-0000-0000-000000000000',
    );
    expect(found).toBeNull();
  });
});
