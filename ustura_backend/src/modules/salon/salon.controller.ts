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
import { OwnedSalonResponseDto } from './dto/owned-salon-response.dto';
import { OwnedSalonSummaryDto } from './dto/owned-salon-summary.dto';
import { PublicSalonDetailDto } from './dto/public-salon-detail.dto';
import { PublicSalonSummaryDto } from './dto/public-salon-summary.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { SalonManagementService } from './salon-management.service';
import { SalonQueryService } from './salon-query.service';

@ApiTags('salons')
@Controller('salons')
export class SalonController {
  constructor(
    private readonly salonQueryService: SalonQueryService,
    private readonly salonManagementService: SalonManagementService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List active salons for public discovery' })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkResponse({ type: PublicSalonSummaryDto, isArray: true })
  async findAll(@Query() query: FindSalonsQueryDto) {
    return this.salonQueryService.findPublicList(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Get('owned')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List salons owned by the authenticated owner' })
  @ApiOkResponse({ type: OwnedSalonSummaryDto, isArray: true })
  async findOwned(@CurrentUser() currentUser: JwtPayload) {
    return this.salonQueryService.findOwned(currentUser);
  }

  @Get(':salonId')
  @ApiOperation({ summary: 'Get a public active salon detail' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: PublicSalonDetailDto })
  async findById(@Param('salonId', new ParseUUIDPipe()) salonId: string) {
    return this.salonQueryService.findPublicById(salonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new salon for the authenticated owner' })
  @ApiCreatedResponse({ type: OwnedSalonResponseDto })
  async create(
    @CurrentUser() currentUser: JwtPayload,
    @Body() createSalonDto: CreateSalonDto,
  ) {
    return this.salonManagementService.create(currentUser, createSalonDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Patch(':salonId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a salon owned by the authenticated owner' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: OwnedSalonResponseDto })
  async update(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Body() updateSalonDto: UpdateSalonDto,
  ) {
    return this.salonManagementService.update(currentUser, salonId, updateSalonDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':salonId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Soft delete a salon owned by the authenticated owner' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: OwnedSalonResponseDto })
  async remove(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    return this.salonManagementService.remove(currentUser, salonId);
  }
}
