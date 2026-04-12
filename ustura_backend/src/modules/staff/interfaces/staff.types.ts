import { Role } from '../../../shared/auth/role.enum';
import type { CreateEmployeeAccountDto } from '../dto/create-employee-account.dto';

export interface StaffMember {
  id: string;
  userId: string;
  salonId: string;
  displayName: string;
  role: Role.BARBER | Role.RECEPTIONIST;
  bio: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStaffInput {
  userId: string;
  salonId: string;
  role: Role.BARBER | Role.RECEPTIONIST;
  bio?: string | null;
  photoUrl?: string | null;
  isActive?: boolean;
}

export interface UpdateStaffInput {
  role?: Role.BARBER | Role.RECEPTIONIST;
  bio?: string | null;
  photoUrl?: string | null;
  isActive?: boolean;
}

export interface StaffProvisioningSelection {
  userId?: string;
  employee?: CreateEmployeeAccountDto;
}
