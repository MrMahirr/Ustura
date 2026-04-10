import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '../../src/config/config.module';
import { DatabaseModule } from '../../src/database/database.module';
import { DatabaseService } from '../../src/database/database.service';
import { UserRepository } from '../../src/modules/user/repositories/user.repository';
import { createContractTestApp } from '../helpers/create-contract-test-app';
import { Role } from '../../src/shared/auth/role.enum';

describe('UserRepository (Integration)', () => {
  let app: INestApplication;
  let databaseService: any;
  let userRepository: UserRepository;

  beforeAll(async () => {
    app = await createContractTestApp({
      imports: [ConfigModule, DatabaseModule],
      providers: [UserRepository],
    });
    databaseService = app.get(DatabaseService);
    userRepository = app.get(UserRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await databaseService.query({
      name: 'test.clear-users',
      text: 'DELETE FROM users',
    });
  });

  it('crud operations working via real database connection', async () => {
    const created = await userRepository.create({
      name: 'Integration Test User',
      email: 'integration@test.com',
      phone: '+905554443322',
      passwordHash: 'hashed123',
      role: Role.CUSTOMER,
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe('Integration Test User');
    expect(created.isActive).toBe(true);
    expect(created.role).toBe(Role.CUSTOMER);

    let found = await userRepository.findById(created.id);
    expect(found?.email).toBe('integration@test.com');

    found = await userRepository.findByPhone('+905554443322');
    expect(found?.id).toBe(created.id);

    const updated = await userRepository.updateProfile(created.id, {
      name: 'Updated Name',
      phone: '+905554443311',
    });
    expect(updated?.name).toBe('Updated Name');
    expect(updated?.phone).toBe('+905554443311');

    await userRepository.linkFirebaseIdentity(created.id, 'firebase-123');
    found = await userRepository.findByFirebaseUid('firebase-123');
    expect(found?.id).toBe(created.id);
    expect(found?.firebaseUid).toBe('firebase-123');

    const deactivated = await userRepository.deactivate(created.id);
    expect(deactivated?.isActive).toBe(false);
  });

  it('find returns null for non existing user', async () => {
    const found = await userRepository.findById('00000000-0000-0000-0000-000000000000');
    expect(found).toBeNull();
  });
});
