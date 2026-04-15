import { HealthService } from '../modules/health/health.service';
import { StartupValidationService } from './startup-validation.service';

type HealthServiceMock = {
  assertReadyForStartup: jest.Mock;
};

function createHealthServiceMock(): HealthServiceMock {
  return {
    assertReadyForStartup: jest.fn(),
  };
}

describe('StartupValidationService', () => {
  let service: StartupValidationService;
  let healthServiceMock: HealthServiceMock;

  beforeEach(() => {
    healthServiceMock = createHealthServiceMock();
    service = new StartupValidationService(
      healthServiceMock as unknown as HealthService,
    );
  });

  it('delegates startup checks to the health service', async () => {
    healthServiceMock.assertReadyForStartup.mockResolvedValue(undefined);

    await expect(service.onApplicationBootstrap()).resolves.toBeUndefined();

    expect(healthServiceMock.assertReadyForStartup).toHaveBeenCalledTimes(1);
  });

  it('bubbles readiness failures', async () => {
    healthServiceMock.assertReadyForStartup.mockRejectedValue(
      new Error(
        'Startup validation failed: database: PostgreSQL connection failed.',
      ),
    );

    await expect(service.onApplicationBootstrap()).rejects.toThrow(
      'Startup validation failed: database: PostgreSQL connection failed.',
    );
  });
});
