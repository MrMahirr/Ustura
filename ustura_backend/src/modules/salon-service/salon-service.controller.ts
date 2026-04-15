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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { Role } from '../../shared/auth/role.enum';
import { CreateSalonServiceDto } from './dto/create-salon-service.dto';
import { SalonServiceResponseDto } from './dto/salon-service-response.dto';
import { UpdateSalonServiceDto } from './dto/update-salon-service.dto';
import { SalonServiceService } from './salon-service.service';

@ApiTags('salon-services')
@Controller('salons/:salonId/services')
export class SalonServiceController {
  constructor(private readonly salonServiceService: SalonServiceService) {}

  @Get()
  @ApiOperation({ summary: 'List public active salon services' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: SalonServiceResponseDto, isArray: true })
  async findBySalonId(@Param('salonId', new ParseUUIDPipe()) salonId: string) {
    return this.salonServiceService.findActiveBySalonId(salonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Get('owned')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List owner-managed salon services' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: SalonServiceResponseDto, isArray: true })
  async findOwnedBySalonId(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    return this.salonServiceService.findOwnedBySalonId(currentUser, salonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a salon service for the owned salon' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiCreatedResponse({ type: SalonServiceResponseDto })
  async create(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Body() createSalonServiceDto: CreateSalonServiceDto,
  ) {
    return this.salonServiceService.create(
      currentUser,
      salonId,
      createSalonServiceDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':serviceId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a salon service owned by the salon owner' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiParam({ name: 'serviceId', format: 'uuid' })
  @ApiOkResponse({ type: SalonServiceResponseDto })
  async update(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
    @Body() updateSalonServiceDto: UpdateSalonServiceDto,
  ) {
    return this.salonServiceService.update(
      currentUser,
      salonId,
      serviceId,
      updateSalonServiceDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':serviceId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete a salon service owned by the salon owner' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiParam({ name: 'serviceId', format: 'uuid' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean', example: true },
      },
    },
  })
  async delete(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
  ) {
    return this.salonServiceService.delete(currentUser, salonId, serviceId);
  }
}
