import { Role } from '../../../common/enums/role.enum';

export interface StaffMember {
  id: string;
  userId: string;
  salonId: string;
  role: Role.BARBER | Role.RECEPTIONIST;
  bio: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
