import { IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator';

export class GetSlotsQueryDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @IsOptional()
  @IsUUID()
  staff_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  requester_selection_owner_id?: string;
}
