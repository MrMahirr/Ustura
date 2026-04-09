import { Role } from '../../../shared/auth/role.enum';

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
  phone?: string;
  passwordHash?: string | null;
  firebaseUid?: string | null;
  allowPasswordless?: boolean;
  allowEmptyPhone?: boolean;
}

export interface CreateEmployeeInput {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role.BARBER | Role.RECEPTIONIST;
}

export interface CreateOwnerInput {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
}

export interface CreateUserRecordInput {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string | null;
  firebaseUid?: string | null;
  allowPasswordless?: boolean;
  allowEmptyPhone?: boolean;
  role: Role;
}

export interface UpdateUserProfileInput {
  name?: string;
  phone?: string;
}
