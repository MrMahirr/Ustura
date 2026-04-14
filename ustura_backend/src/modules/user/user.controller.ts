import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { PrincipalKind } from '../../shared/auth/principal-kind.enum';
import { roleToPrincipalKind } from '../../shared/auth/principal-kind.mapper';
import { Role } from '../../shared/auth/role.enum';
import { AdminPatchUserStatusDto } from './dto/admin-patch-user-status.dto';
import { AdminUpdateUserProfileDto } from './dto/admin-update-user-profile.dto';
import { FindAdminUsersQueryDto } from './dto/find-admin-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAdminManagementService } from './user-admin-management.service';
import { UserAdminQueryService } from './user-admin-query.service';
import { UserProfileService } from './user-profile.service';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly userAdminQueryService: UserAdminQueryService,
    private readonly userAdminManagementService: UserAdminManagementService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List users for super admin management' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: ['manager', 'owner', 'employee'] })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'busy', 'inactive', 'suspended'] })
  @ApiQuery({ name: 'salonId', required: false, type: String, format: 'uuid' })
  @ApiQuery({ name: 'city', required: false, type: String })
  async findAdminUsers(@Query() query: FindAdminUsersQueryDto) {
    return this.userAdminQueryService.findAdminUsers(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get a single admin user detail record' })
  async findAdminUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userAdminQueryService.findAdminUserById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/:id/detail')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get enriched admin user detail with stats, reservations, activity, schedule' })
  async findAdminUserDetail(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userAdminQueryService.findAdminUserDetail(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch('admin/:id/status')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Activate or suspend a personnel or platform admin account' })
  async patchAdminUserStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AdminPatchUserStatusDto,
    @CurrentUser() currentUser?: JwtPayload,
  ) {
    const actor = this.requireAuthenticatedUser(currentUser);
    return this.userAdminManagementService.setManagedUserActive(
      actor.sub,
      id,
      body.isActive,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch('admin/:id/profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update name/phone of a personnel or platform admin account' })
  async patchAdminUserProfile(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AdminUpdateUserProfileDto,
  ) {
    return this.userAdminManagementService.updateManagedUserProfile(id, body);
  }

  @Get('me')
  async getMyProfile(@CurrentUser() currentUser?: JwtPayload) {
    const user = this.requireAuthenticatedUser(currentUser);
    return this.userProfileService.getProfileByPrincipal(
      this.resolvePrincipalKind(user),
      user.sub,
    );
  }

  @Patch('me')
  async updateMyProfile(
    @CurrentUser() currentUser: JwtPayload | undefined,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = this.requireAuthenticatedUser(currentUser);
    return this.userProfileService.updateProfile(
      this.resolvePrincipalKind(user),
      user.sub,
      updateUserDto,
    );
  }

  private requireAuthenticatedUser(currentUser?: JwtPayload): JwtPayload {
    if (!currentUser?.sub) {
      throw new UnauthorizedException('Authentication required.');
    }

    return currentUser;
  }

  private resolvePrincipalKind(payload: JwtPayload): PrincipalKind {
    return payload.principalKind ?? roleToPrincipalKind(payload.role);
  }
}
