import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

const STAFF_ROLES = [Role.BARBER, Role.RECEPTIONIST] as const;

export class UpdateStaffDto {
  @IsOptional()
  @IsIn(STAFF_ROLES)
  role?: Role.BARBER | Role.RECEPTIONIST;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  photo_url?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
