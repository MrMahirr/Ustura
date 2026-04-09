import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { HealthService } from '../modules/health/health.service';

@Injectable()
export class StartupValidationService implements OnApplicationBootstrap {
  private readonly logger = new Logger(StartupValidationService.name);

  constructor(private readonly healthService: HealthService) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Validating infrastructure dependencies.');
    await this.healthService.assertReadyForStartup();

    this.logger.log('Infrastructure dependencies are ready.');
  }
}
