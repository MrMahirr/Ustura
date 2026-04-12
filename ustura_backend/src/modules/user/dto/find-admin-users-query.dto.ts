import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import type {
  AdminUserRole,
  AdminUserStatus,
} from '../interfaces/user.types';

export class FindAdminUsersQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @IsOptional()
  @IsIn(['manager', 'owner', 'employee'] satisfies AdminUserRole[])
  role?: AdminUserRole;

  @IsOptional()
  @IsIn(['active', 'busy', 'inactive', 'suspended'] satisfies AdminUserStatus[])
  status?: AdminUserStatus;

  @IsOptional()
  @IsUUID()
  salonId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;
}
