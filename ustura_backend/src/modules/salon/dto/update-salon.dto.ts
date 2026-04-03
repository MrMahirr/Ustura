// TODO: class-validator dekoratörleri eklenecek
export class UpdateSalonDto {
  name?: string;
  address?: string;
  city?: string;
  district?: string;
  photo_url?: string;
  working_hours?: Record<string, any>;
  is_active?: boolean;
}
