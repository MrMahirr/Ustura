import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { Role } from '../../shared/auth/role.enum';
import { CreateOwnerApplicationDto } from './dto/create-owner-application.dto';
import { OwnerApplicationResponseDto } from './dto/owner-application-response.dto';
import { RejectOwnerApplicationDto } from './dto/reject-owner-application.dto';
import { UpdateOwnerApplicationDto } from './dto/update-owner-application.dto';
import { AppConfigService } from '../../config/config.service';
import { PlatformAdminService } from './platform-admin.service';

@ApiTags('platform-admin')
@Controller()
export class PlatformAdminController {
  constructor(
    private readonly platformAdminService: PlatformAdminService,
    private readonly configService: AppConfigService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/platform-settings')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get platform settings for super admin' })
  async getPlatformSettings() {
    return {
      general: {
        platformName: 'Ustura',
        apiPrefix: this.configService.app.apiPrefix,
        nodeEnv: this.configService.app.nodeEnv,
        port: this.configService.app.port,
        frontendUrl: this.configService.frontend.baseUrl,
        corsOrigins: this.configService.cors.origins,
        corsCredentials: this.configService.cors.credentials,
      },
      security: {
        jwtAccessExpiration: this.configService.jwt.accessExpiresIn,
        jwtRefreshExpiration: this.configService.jwt.refreshExpiresIn,
        rateLimitTtl: 60,
        rateLimitMax: 60,
      },
      email: {
        serviceId: this.configService.emailJs.serviceId
          ? this.maskValue(this.configService.emailJs.serviceId)
          : null,
        templateApproval: this.configService.emailJs.templateApproval || null,
        templateStaffWelcome: this.configService.emailJs.templateStaffWelcome || null,
        hasPublicKey: !!this.configService.emailJs.publicKey,
        hasPrivateKey: !!this.configService.emailJs.privateKey,
      },
      reservation: {
        slotDurationMinutes: this.configService.reservation.slotDurationMinutes,
        slotSelectionTtlSeconds: this.configService.reservation.slotSelectionTtlSeconds,
        slotLockTtlSeconds: this.configService.reservation.slotLockTtlSeconds,
        businessTimeZone: this.configService.reservation.businessTimeZone,
        businessUtcOffset: this.configService.reservation.businessUtcOffset,
      },
      integrations: {
        firebaseProjectId: this.configService.firebase.projectId
          ? this.maskValue(this.configService.firebase.projectId)
          : null,
        googleWebClientId: this.configService.google.webClientId
          ? this.maskValue(this.configService.google.webClientId)
          : null,
        redisHost: this.configService.redis.host || null,
        redisPort: this.configService.redis.port || null,
        databaseHost: this.configService.database.host || null,
        databasePort: this.configService.database.port || null,
        databaseName: this.configService.database.database || null,
      },
    };
  }

  private maskValue(value: string): string {
    if (value.length <= 6) return '••••••';
    return value.slice(0, 3) + '•'.repeat(Math.min(value.length - 6, 10)) + value.slice(-3);
  }

  @Post('owner-applications')
  @ApiOperation({ summary: 'Submit a new owner onboarding application' })
  @ApiBody({ type: CreateOwnerApplicationDto })
  @ApiCreatedResponse({ type: OwnerApplicationResponseDto })
  async createOwnerApplication(
    @Body() createOwnerApplicationDto: CreateOwnerApplicationDto,
  ) {
    return this.platformAdminService.createOwnerApplication(
      createOwnerApplicationDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/owner-applications')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List owner applications for super admins' })
  @ApiOkResponse({ type: OwnerApplicationResponseDto, isArray: true })
  async listOwnerApplications(@CurrentUser() currentUser: JwtPayload) {
    return this.platformAdminService.listOwnerApplications(currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('admin/owner-applications/:applicationId/approve')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Approve an owner application as super admin' })
  @ApiParam({ name: 'applicationId', format: 'uuid' })
  @ApiOkResponse({ type: OwnerApplicationResponseDto })
  async approveOwnerApplication(
    @CurrentUser() currentUser: JwtPayload,
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
  ) {
    return this.platformAdminService.approveOwnerApplication(
      currentUser,
      applicationId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch('admin/owner-applications/:applicationId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update a pending owner application (super admin)',
  })
  @ApiParam({ name: 'applicationId', format: 'uuid' })
  @ApiBody({ type: UpdateOwnerApplicationDto })
  @ApiOkResponse({ type: OwnerApplicationResponseDto })
  async updateOwnerApplication(
    @CurrentUser() currentUser: JwtPayload,
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() updateOwnerApplicationDto: UpdateOwnerApplicationDto,
  ) {
    return this.platformAdminService.updateOwnerApplication(
      currentUser,
      applicationId,
      updateOwnerApplicationDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('admin/owner-applications/:applicationId/reject')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Reject an owner application as super admin' })
  @ApiParam({ name: 'applicationId', format: 'uuid' })
  @ApiBody({ type: RejectOwnerApplicationDto })
  @ApiOkResponse({ type: OwnerApplicationResponseDto })
  async rejectOwnerApplication(
    @CurrentUser() currentUser: JwtPayload,
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() rejectOwnerApplicationDto: RejectOwnerApplicationDto,
  ) {
    return this.platformAdminService.rejectOwnerApplication(
      currentUser,
      applicationId,
      rejectOwnerApplicationDto,
    );
  }
}
