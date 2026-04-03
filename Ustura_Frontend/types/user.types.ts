export type Role = 'super_admin' | 'owner' | 'barber' | 'receptionist' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
