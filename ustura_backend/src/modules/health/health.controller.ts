import { Controller, Get, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @ApiOperation({ summary: 'Report process liveness' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
        timestamp: {
          type: 'string',
          example: '2026-04-09T10:30:00.000Z',
        },
      },
    },
  })
  getLiveness() {
    return this.healthService.getLiveness();
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Report infrastructure readiness for PostgreSQL, schema and Redis',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ready',
        },
        timestamp: {
          type: 'string',
          example: '2026-04-09T10:30:00.000Z',
        },
        checks: {
          type: 'object',
        },
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'Infrastructure dependencies are not ready.',
  })
  async getReadiness(@Res({ passthrough: true }) response: Response) {
    const report = await this.healthService.getReadiness();

    if (report.status !== 'ready') {
      response.status(503);
    }

    return report;
  }
}
