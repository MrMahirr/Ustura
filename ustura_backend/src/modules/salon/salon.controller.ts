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
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/auth/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { AdminSalonDetailDto } from './dto/admin-salon-detail.dto';
import { AdminSalonSummaryDto } from './dto/admin-salon-summary.dto';
import { CreateSalonDto } from './dto/create-salon.dto';
import { FindAdminSalonsQueryDto } from './dto/find-admin-salons-query.dto';
import { FindSalonsQueryDto } from './dto/find-salons-query.dto';
import { OwnedSalonResponseDto } from './dto/owned-salon-response.dto';
import { OwnedSalonSummaryDto } from './dto/owned-salon-summary.dto';
import { PaginatedAdminSalonResponseDto } from './dto/paginated-admin-salon-response.dto';
import { PaginatedPublicSalonResponseDto } from './dto/paginated-public-salon-response.dto';
import { PublicSalonDetailDto } from './dto/public-salon-detail.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { SalonManagementService } from './salon-management.service';
import { SalonMediaService } from './salon-media.service';
import { SalonQueryService } from './salon-query.service';

@ApiTags('salons')
@Controller('salons')
export class SalonController {
  constructor(
    private readonly salonQueryService: SalonQueryService,
    private readonly salonManagementService: SalonManagementService,
    private readonly salonMediaService: SalonMediaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List active salons for public discovery' })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 6 })
  @ApiOkResponse({ type: PaginatedPublicSalonResponseDto })
  async findAll(@Query() query: FindSalonsQueryDto) {
    return this.salonQueryService.findPublicList(query);
  }

  @Get('cities')
  @ApiOperation({
    summary: 'List distinct active salon cities for public filters',
  })
  @ApiOkResponse({ type: String, isArray: true })
  async findCities() {
    return this.salonQueryService.findPublicCities();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List salons for super admin management' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive'],
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['newest', 'name_asc', 'name_desc', 'updated_desc'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 4 })
  @ApiOkResponse({ type: PaginatedAdminSalonResponseDto })
  async findAdminSalons(@Query() query: FindAdminSalonsQueryDto) {
    return this.salonQueryService.findAdminList(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/cities')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List salon cities for super admin filters' })
  @ApiOkResponse({ type: String, isArray: true })
  async findAdminCities() {
    return this.salonQueryService.findAdminCities();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/:salonId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Super admin: tek salon detayi (mesai dahil)' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: AdminSalonDetailDto })
  async findAdminSalonById(
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    return this.salonQueryService.findAdminSalonById(salonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch('admin/:salonId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Super admin: salon alanlarini guncelle (ad, adres, sehir, ilce, foto, mesai, aktiflik)',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiBody({ type: UpdateSalonDto })
  @ApiOkResponse({ type: AdminSalonSummaryDto })
  async adminUpdateSalon(
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Body() dto: UpdateSalonDto,
  ) {
    return this.salonManagementService.adminUpdateSalon(salonId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete('admin/:salonId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Super admin: salonu kalıcı sil (bağlı staff / rezervasyonlar cascade; abonelikler silinir)',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  async adminDeleteSalon(
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    await this.salonManagementService.adminDeleteSalon(salonId);
    return { deleted: true };
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Get('owned/:salonId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get an owned salon detail for the authenticated owner',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: OwnedSalonResponseDto })
  async findOwnedById(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    return this.salonQueryService.findOwnedById(currentUser, salonId);
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
    return this.salonManagementService.update(
      currentUser,
      salonId,
      updateSalonDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post(':salonId/storefront-photo')
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
    summary: 'Upload and assign a local storefront photo for an owned salon',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
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
  @ApiOkResponse({ type: OwnedSalonResponseDto })
  async uploadStorefrontPhoto(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @UploadedFile() file: unknown,
    @Req() request: Request,
  ) {
    return this.salonMediaService.uploadOwnedStorefrontPhoto(
      currentUser,
      salonId,
      file as never,
      this.resolveRequestBaseUrl(request),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':salonId/storefront-photo')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove the storefront photo for an owned salon' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: OwnedSalonResponseDto })
  async removeStorefrontPhoto(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    return this.salonMediaService.removeOwnedStorefrontPhoto(
      currentUser,
      salonId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Post(':salonId/storefront-gallery')
  @UseInterceptors(
    FilesInterceptor('files', 8, {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload one or more gallery photos for an owned salon',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files'],
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOkResponse({ type: OwnedSalonResponseDto })
  async uploadStorefrontGallery(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @UploadedFiles() files: unknown[],
    @Req() request: Request,
  ) {
    return this.salonMediaService.uploadOwnedGalleryPhotos(
      currentUser,
      salonId,
      files as never,
      this.resolveRequestBaseUrl(request),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':salonId/storefront-gallery')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove a gallery photo for an owned salon' })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiQuery({ name: 'photoUrl', required: true, type: String })
  @ApiOkResponse({ type: OwnedSalonResponseDto })
  async removeStorefrontGalleryPhoto(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
    @Query('photoUrl') photoUrl: string,
  ) {
    return this.salonMediaService.removeOwnedGalleryPhoto(
      currentUser,
      salonId,
      photoUrl,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OWNER)
  @Delete(':salonId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Soft delete a salon owned by the authenticated owner',
  })
  @ApiParam({ name: 'salonId', format: 'uuid' })
  @ApiOkResponse({ type: OwnedSalonResponseDto })
  async remove(
    @CurrentUser() currentUser: JwtPayload,
    @Param('salonId', new ParseUUIDPipe()) salonId: string,
  ) {
    return this.salonManagementService.remove(currentUser, salonId);
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
