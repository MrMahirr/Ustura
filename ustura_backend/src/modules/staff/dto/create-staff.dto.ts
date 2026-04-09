import {
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

const STAFF_ROLES = [Role.BARBER, Role.RECEPTIONIST] as const;

export class CreateStaffDto {
  @IsUUID()
  user_id: string;

  @IsIn(STAFF_ROLES)
  role: Role.BARBER | Role.RECEPTIONIST;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  photo_url?: string;
}
