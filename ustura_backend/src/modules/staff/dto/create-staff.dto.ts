// TODO: class-validator dekoratörleri eklenecek
export class CreateStaffDto {
  user_id: string;
  role: string;   // 'barber' | 'receptionist'
  bio?: string;
  photo_url?: string;
}
