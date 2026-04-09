import { IsISO8601 } from 'class-validator';
import { SlotRoomDto } from './slot-room.dto';

export class SlotSelectionDto extends SlotRoomDto {
  @IsISO8601()
  slotStart: string;
}
