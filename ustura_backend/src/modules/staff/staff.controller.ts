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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffResponseDto } from './dto/staff-response.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffService } from './staff.service';

@ApiTags('staff')
@Controller('salons/:salonId/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @ApiOperation({ summary: 'List active staff members for a salon' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: StaffResponseDto, isArray: true })
  async findBySalonId(
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    return this.staffService.findBySalonId(salonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create or reactivate a staff membership for a salon' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiCreatedResponse({ type: StaffResponseDto })
  async create(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Body() createStaffDto: CreateStaffDto,
  ) {
    return this.staffService.create(currentUser, salonId, createStaffDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':staffId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a staff membership owned by the salon owner' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiParam({ name: 'staffId', format: 'uuid' })
  @ApiOkResponse({ type: StaffResponseDto })
  async update(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffService.update(
      currentUser,
      salonId,
      staffId,
      updateStaffDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':staffId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Deactivate a staff membership owned by the salon owner' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiParam({ name: 'staffId', format: 'uuid' })
  @ApiOkResponse({ type: StaffResponseDto })
  async delete(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
  ) {
    return this.staffService.delete(currentUser, salonId, staffId);
  }
}
