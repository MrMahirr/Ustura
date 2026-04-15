import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { Role } from '../../shared/auth/role.enum';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { RequestSubscriptionDto } from './dto/request-subscription.dto';
import { UpdateSubscriptionStatusDto } from './dto/update-subscription-status.dto';

@ApiTags('packages')
@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  @ApiOperation({ summary: 'List all active packages' })
  async getAllPackages() {
    return this.packageService.getAllPackages();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.BARBER, Role.RECEPTIONIST)
  @Get('my-subscription')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get current salon subscription and usage for the logged-in staff',
  })
  async getMySalonSubscription(@CurrentUser() user: JwtPayload) {
    return this.packageService.getMySalonSubscription(user.sub, user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER, Role.BARBER, Role.RECEPTIONIST)
  @Post('request-subscription')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Request a package subscription (creates pending subscription for admin approval)',
  })
  async requestSubscription(
    @CurrentUser() user: JwtPayload,
    @Body() input: RequestSubscriptionDto,
  ) {
    return this.packageService.requestSubscription(
      user.sub,
      user.role,
      input.packageId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List all packages for super admin management' })
  async getAdminPackages() {
    return this.packageService.getAdminPackages();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('overview')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get package and subscription overview stats for admin',
  })
  async getOverviewStats() {
    return this.packageService.getOverviewStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('subscriptions')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List all salon subscriptions for admin' })
  async getAllSubscriptions() {
    return this.packageService.getAllSubscriptions();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('approvals')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List package approval queue for admin' })
  async getPackageApprovals() {
    return this.packageService.getPackageApprovals();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch('subscriptions/:id/status')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update subscription status for package approvals' })
  async updateSubscriptionStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdateSubscriptionStatusDto,
  ) {
    return this.packageService.updateSubscriptionStatus(id, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get package details (with subscribers for admin)' })
  async getPackageById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.packageService.getPackageById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new package' })
  async createPackage(@Body() input: CreatePackageDto) {
    return this.packageService.createPackage(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an existing package' })
  async updatePackage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdatePackageDto,
  ) {
    return this.packageService.updatePackage(id, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Super admin: paketi kalici sil (abonelik yoksa; aksi halde 400)',
  })
  async deletePackage(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.packageService.deletePackage(id);
  }
}
