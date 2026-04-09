import { Matches, IsUUID } from 'class-validator';

export class SlotRoomDto {
  @IsUUID()
  salonId: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @IsUUID()
  staffId: string;
}
