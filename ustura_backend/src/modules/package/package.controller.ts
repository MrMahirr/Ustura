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
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../shared/auth/role.enum';
import { PackageService } from './package.service';
import { CreatePackageInput, UpdatePackageInput } from './interfaces/package.types';

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
  @Roles(Role.SUPER_ADMIN)
  @Get('overview')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get package and subscription overview stats for admin' })
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

  @Get(':id')
  @ApiOperation({ summary: 'Get package details (with subscribers for admin)' })
  async getPackageById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.packageService.getPackageById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new package' })
  async createPackage(@Body() input: CreatePackageInput) {
    return this.packageService.createPackage(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an existing package' })
  async updatePackage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() input: UpdatePackageInput,
  ) {
    return this.packageService.updatePackage(id, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Deactivate a package' })
  async deactivatePackage(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.packageService.updatePackage(id, { isActive: false });
  }
}
