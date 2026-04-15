import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/auth/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { CreateStaffDto } from './dto/create-staff.dto';
import { StaffResponseDto } from './dto/staff-response.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffMediaService } from './staff-media.service';
import { StaffService } from './staff.service';

@ApiTags('staff')
@Controller('salons/:salonId/staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly staffMediaService: StaffMediaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List active staff members for a salon' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: StaffResponseDto, isArray: true })
  async findBySalonId(@Param('salonId', new ParseUUIDPipe()) salonId: string) {
    return this.staffService.findBySalonId(salonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create or reactivate a staff membership for a salon',
  })
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
  @ApiOperation({
    summary: 'Update a staff membership owned by the salon owner',
  })
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
  @Post(':staffId/photo')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload and assign a local profile photo for a salon staff member',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiParam({ name: 'staffId', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: StaffResponseDto })
  async uploadPhoto(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
    @UploadedFile() file: unknown,
    @Req() request: Request,
  ) {
    return this.staffMediaService.uploadManagedPhoto(
      currentUser,
      salonId,
      staffId,
      file as never,
      this.resolveRequestBaseUrl(request),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':staffId/photo')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Remove the local profile photo for a salon staff member',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiParam({ name: 'staffId', format: 'uuid' })
  @ApiOkResponse({ type: StaffResponseDto })
  async removePhoto(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
  ) {
    return this.staffMediaService.removeManagedPhoto(
      currentUser,
      salonId,
      staffId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':staffId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Deactivate a staff membership owned by the salon owner',
  })
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

  private resolveRequestBaseUrl(request: Request): string {
    const forwardedProtoHeader = request.headers['x-forwarded-proto'];
    const forwardedProto = Array.isArray(forwardedProtoHeader)
      ? forwardedProtoHeader[0]
      : forwardedProtoHeader;
    const protocol = forwardedProto?.split(',')[0]?.trim() || request.protocol;
    const host = request.get('host');
    return `${protocol}://${host}`;
  }
}
