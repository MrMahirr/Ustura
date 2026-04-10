import {
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '../../../shared/auth/role.enum';
import { CreateEmployeeAccountDto } from './create-employee-account.dto';

const STAFF_ROLES = [Role.BARBER, Role.RECEPTIONIST] as const;

export class CreateStaffDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEmployeeAccountDto)
  employee?: CreateEmployeeAccountDto;

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
  photoUrl?: string;
}
