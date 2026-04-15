import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../../../shared/auth/role.enum';
import { UpdateManagedEmployeeAccountDto } from './update-managed-employee-account.dto';

const STAFF_ROLES = [Role.BARBER, Role.RECEPTIONIST] as const;

export class UpdateStaffDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateManagedEmployeeAccountDto)
  account?: UpdateManagedEmployeeAccountDto;

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
  photoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
