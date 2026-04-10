import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { AuditLogAction } from '../enums/audit-log-action.enum';
import { AuditLogEntityType } from '../enums/audit-log-entity-type.enum';

export class ListAuditLogsQueryDto {
  @IsOptional()
  @IsUUID()
  actorUserId?: string;

  @IsOptional()
  @IsEnum(AuditLogAction)
  action?: AuditLogAction;

  @IsOptional()
  @IsEnum(AuditLogEntityType)
  entityType?: AuditLogEntityType;

  @IsOptional()
  @IsUUID()
  entityId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 50;
}
