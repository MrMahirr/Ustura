import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '../../src/config/config.module';
import { DatabaseModule } from '../../src/database/database.module';
import { DatabaseService } from '../../src/database/database.service';
import { SalonRepository } from '../../src/modules/salon/repositories/salon.repository';
import { createContractTestApp } from '../helpers/create-contract-test-app';

describe('SalonRepository (Integration)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let salonRepository: SalonRepository;

  let ownerId: string;

  beforeAll(async () => {
    app = await createContractTestApp({
      imports: [ConfigModule, DatabaseModule],
      providers: [SalonRepository],
    });
    databaseService = app.get(DatabaseService);
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

    const userResult = await databaseService.query({
      text: `INSERT INTO users (name, email, phone, role) VALUES ('Owner', 'owner1@test.com', '111', 'owner') RETURNING id`,
    });
    ownerId = userResult.rows[0].id;
  });

  it('crud operations and filtering working via real database connection', async () => {
    const created = await salonRepository.create({
      ownerId,
      name: 'Integration Test Salon',
      address: 'Test Addr',
      city: 'Istanbul',
      photoUrl: null,
      district: null,
      workingHours: { monday: { open: '09:00', close: '18:00' } },
    });

    expect(created.id).toBeDefined();
    expect(created.city).toBe('Istanbul');
    expect(created.isActive).toBe(true);
    expect(created.ownerId).toBe(ownerId);

    const foundById = await salonRepository.findById(created.id);
    expect(foundById?.name).toBe('Integration Test Salon');

    const updated = await salonRepository.update(created.id, {
      city: 'Izmir',
      district: 'Bornova',
    });
    expect(updated?.city).toBe('Izmir');
    expect(updated?.district).toBe('Bornova');

    let allSalons = await salonRepository.findAll();
    expect(allSalons).toHaveLength(1);

    allSalons = await salonRepository.findAll({ city: 'Ankara' });
    expect(allSalons).toHaveLength(0);

    allSalons = await salonRepository.findAll({ search: 'Test' });
    expect(allSalons).toHaveLength(1);

    const deactivated = await salonRepository.deactivate(created.id);
    expect(deactivated?.isActive).toBe(false);

    allSalons = await salonRepository.findAll();
    expect(allSalons).toHaveLength(0);

    allSalons = await salonRepository.findAll({ includeInactive: true });
    expect(allSalons).toHaveLength(1);

    const ownerSalons = await salonRepository.findByOwnerId(ownerId);
    expect(ownerSalons).toHaveLength(1);
  });

  it('find returns null for non existing salon', async () => {
    const found = await salonRepository.findById('00000000-0000-0000-0000-000000000000');
    expect(found).toBeNull();
  });
});
