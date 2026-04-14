import { ApiProperty } from '@nestjs/swagger';
import { PrincipalKind } from '../../../shared/auth/principal-kind.enum';

export class NotificationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ nullable: true, format: 'uuid' })
  recipientId: string | null;

  @ApiProperty({ enum: PrincipalKind })
  recipientKind: PrincipalKind;

  @ApiProperty()
  key: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty({ enum: ['success', 'warning', 'error', 'primary'] })
  tone: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  metadata: Record<string, unknown>;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class NotificationListResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  items: NotificationResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty({
    description:
      'Unread count in the same scope as mark-all (global for super admin, recipient-scoped otherwise).',
  })
  unreadTotal: number;
}
