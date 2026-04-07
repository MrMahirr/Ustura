import { Role } from '../../../common/enums/role.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string | null;
  firebaseUid: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserProfile = Omit<User, 'passwordHash' | 'firebaseUid'>;

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone: string;
  passwordHash?: string | null;
  firebaseUid?: string | null;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role.BARBER | Role.RECEPTIONIST;
}

export interface CreateUserRecordInput {
  name: string;
  email: string;
  phone: string;
  passwordHash?: string | null;
  firebaseUid?: string | null;
  role: Role;
}

export interface UpdateUserProfileInput {
  name?: string;
  phone?: string;
}
