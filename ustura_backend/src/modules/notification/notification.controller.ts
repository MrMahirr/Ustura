import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import { Role } from '../../shared/auth/role.enum';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import {
  NotificationListResponseDto,
  NotificationResponseDto,
} from './dto/notification-response.dto';
import { NotificationService } from './notification.service';

@ApiTags('notifications')
@Controller('admin/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List notifications (super admin / owner)' })
  @ApiOkResponse({ type: NotificationListResponseDto })
  async list(
    @CurrentUser() currentUser: JwtPayload,
    @Query() query: ListNotificationsQueryDto,
  ) {
    return this.notificationService.list(currentUser, query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @Patch(':id/read')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiOkResponse({ type: NotificationResponseDto })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.OWNER)
  @Post('read-all')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead() {
    const count = await this.notificationService.markAllAsRead();
    return { markedCount: count };
  }
}
