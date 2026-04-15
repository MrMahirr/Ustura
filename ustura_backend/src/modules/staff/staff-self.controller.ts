import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../../shared/auth/role.enum';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { StaffResponseDto } from './dto/staff-response.dto';
import { StaffMediaService } from './staff-media.service';
import { StaffService } from './staff.service';

@ApiTags('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BARBER, Role.RECEPTIONIST)
@Controller('staff')
export class StaffSelfController {
  constructor(
    private readonly staffService: StaffService,
    private readonly staffMediaService: StaffMediaService,
  ) {}

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List active staff memberships for the authenticated staff user',
  })
  @ApiOkResponse({ type: StaffResponseDto, isArray: true })
  async findMyAssignments(@CurrentUser() currentUser: JwtPayload) {
    return this.staffService.findMyAssignments(currentUser);
  }

  @Post('me/:staffId/photo')
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
    summary:
      'Upload and assign a local profile photo for the authenticated staff assignment',
  })
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
  async uploadOwnPhoto(
    @CurrentUser() currentUser: JwtPayload,
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
    @UploadedFile() file: unknown,
    @Req() request: Request,
  ) {
    return this.staffMediaService.uploadOwnPhoto(
      currentUser,
      staffId,
      file as never,
      this.resolveRequestBaseUrl(request),
    );
  }

  @Delete('me/:staffId/photo')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary:
      'Remove the local profile photo for the authenticated staff assignment',
  })
  @ApiParam({ name: 'staffId', format: 'uuid' })
  @ApiOkResponse({ type: StaffResponseDto })
  async removeOwnPhoto(
    @CurrentUser() currentUser: JwtPayload,
    @Param('staffId', new ParseUUIDPipe()) staffId: string,
  ) {
    return this.staffMediaService.removeOwnPhoto(currentUser, staffId);
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
