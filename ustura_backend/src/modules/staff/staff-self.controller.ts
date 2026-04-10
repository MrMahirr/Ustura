import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../shared/auth/role.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { StaffResponseDto } from './dto/staff-response.dto';
import { StaffService } from './staff.service';

@ApiTags('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BARBER, Role.RECEPTIONIST)
@Controller('staff')
export class StaffSelfController {
  constructor(private readonly staffService: StaffService) {}

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List active staff memberships for the authenticated staff user' })
  @ApiOkResponse({ type: StaffResponseDto, isArray: true })
  async findMyAssignments(@CurrentUser() currentUser: JwtPayload) {
    return this.staffService.findMyAssignments(currentUser);
  }
}
