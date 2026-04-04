export interface WorkingHours {
  [day: string]: { open: string; close: string } | null;
}

export interface Salon {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  city: string;
  district?: string;
  photo_url?: string;
  working_hours: WorkingHours;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
