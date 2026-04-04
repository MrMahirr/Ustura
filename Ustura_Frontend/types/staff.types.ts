export type StaffRole = 'barber' | 'receptionist';

export interface Staff {
  id: string;
  user_id: string;
  salon_id: string;
  role: StaffRole;
  bio?: string;
  photo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
