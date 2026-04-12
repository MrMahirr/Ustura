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
import { Role } from '../../shared/auth/role.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { FindAdminUsersQueryDto } from './dto/find-admin-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAdminQueryService } from './user-admin-query.service';
import { UserProfileService } from './user-profile.service';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly userAdminQueryService: UserAdminQueryService,
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

  @Get('me')
  async getMyProfile(@CurrentUser() currentUser?: JwtPayload) {
    return this.userProfileService.getProfileById(
      this.requireAuthenticatedUserId(currentUser),
    );
  }

  @Patch('me')
  async updateMyProfile(
    @CurrentUser() currentUser: JwtPayload | undefined,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userProfileService.updateProfile(
      this.requireAuthenticatedUserId(currentUser),
      updateUserDto,
    );
  }

  private requireAuthenticatedUserId(currentUser?: JwtPayload): string {
    if (!currentUser?.sub) {
      throw new UnauthorizedException('Authentication required.');
    }

    return currentUser.sub;
  }
}
