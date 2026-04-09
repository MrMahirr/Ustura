import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/auth/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { CreateSalonDto } from './dto/create-salon.dto';
import { FindSalonsQueryDto } from './dto/find-salons-query.dto';
import { SalonResponseDto } from './dto/salon-response.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { SalonService } from './salon.service';

@ApiTags('salons')
@Controller('salons')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @Get()
  @ApiOperation({ summary: 'List active salons for public discovery' })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkResponse({ type: SalonResponseDto, isArray: true })
  async findAll(@Query() query: FindSalonsQueryDto) {
    return this.salonService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Get('owned')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List salons owned by the authenticated owner' })
  @ApiOkResponse({ type: SalonResponseDto, isArray: true })
  async findOwned(@CurrentUser() currentUser: JwtPayload) {
    return this.salonService.findOwned(currentUser);
  }

  @Get(':salonId')
  @ApiOperation({ summary: 'Get a public active salon detail' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: SalonResponseDto })
  async findById(@Param('salonId', new ParseUUIDPipe()) salonId: string) {
    return this.salonService.findById(salonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new salon for the authenticated owner' })
  @ApiCreatedResponse({ type: SalonResponseDto })
  async create(
    @CurrentUser() currentUser: JwtPayload,
    @Body() createSalonDto: CreateSalonDto,
  ) {
    return this.salonService.create(currentUser, createSalonDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':salonId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a salon owned by the authenticated owner' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: SalonResponseDto })
  async update(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Body() updateSalonDto: UpdateSalonDto,
  ) {
    return this.salonService.update(currentUser, salonId, updateSalonDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':salonId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Soft delete a salon owned by the authenticated owner' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: SalonResponseDto })
  async remove(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    return this.salonService.remove(currentUser, salonId);
  }
}
