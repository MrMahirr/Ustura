// TODO: class-validator dekoratörleri eklenecek
export class CreateReservationDto {
  salon_id: string;
  staff_id: string;
  slot_start: string; // ISO 8601 datetime
  notes?: string;
}
