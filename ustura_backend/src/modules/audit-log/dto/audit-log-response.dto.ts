import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../shared/auth/role.enum';
import { AuditLogAction } from '../enums/audit-log-action.enum';
import { AuditLogEntityType } from '../enums/audit-log-entity-type.enum';

export class AuditLogResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ nullable: true, format: 'uuid' })
  actorUserId: string | null;

  @ApiProperty({ enum: Role, nullable: true })
  actorRole: Role | null;

  @ApiProperty({ enum: AuditLogAction })
  action: AuditLogAction;

  @ApiProperty({ enum: AuditLogEntityType })
  entityType: AuditLogEntityType;

  @ApiProperty({ nullable: true, format: 'uuid' })
  entityId: string | null;

  @ApiProperty({ type: 'object', additionalProperties: true })
  metadata: Record<string, unknown>;

  @ApiProperty()
  createdAt: Date;
}
