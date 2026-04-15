import type { SqlQueryExecutor } from '../../../database/database.types';
import type { PrincipalKind } from '../../../shared/auth/principal-kind.enum';
import type {
  CreateCustomerInput,
  CreateEmployeeInput,
  CreateOwnerInput,
  UpdateManagedEmployeeInput,
  User,
  UserProfile,
} from './user.types';

export const USER_QUERY_SERVICE = Symbol('USER_QUERY_SERVICE');

export interface UserQueryServiceContract {
  findByPrincipal(kind: PrincipalKind, id: string): Promise<User | null>;
  findByEmailForPrincipal(
    email: string,
    kind: PrincipalKind,
  ): Promise<User | null>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
}

export const USER_PROVISIONING_SERVICE = Symbol('USER_PROVISIONING_SERVICE');

export interface UserProvisioningServiceContract {
  createCustomer(input: CreateCustomerInput): Promise<User>;
  findOrCreateManagedCustomer(input: {
    name: string;
    email: string;
    phone: string;
  }): Promise<User>;
  createEmployee(
    input: CreateEmployeeInput,
    executor?: SqlQueryExecutor,
  ): Promise<User>;
  createOwner(
    input: CreateOwnerInput,
    executor?: SqlQueryExecutor,
  ): Promise<User>;
  resetPersonnelPassword(
    id: string,
    password: string,
    options?: { mustChangePassword?: boolean },
    executor?: SqlQueryExecutor,
  ): Promise<User>;
  changeOwnPassword(
    kind: PrincipalKind,
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User>;
  updateManagedEmployee(
    id: string,
    input: UpdateManagedEmployeeInput,
    executor?: SqlQueryExecutor,
  ): Promise<User>;
  deactivateUser(kind: PrincipalKind, id: string): Promise<UserProfile>;
  linkFirebaseCustomerIdentity(id: string, firebaseUid: string): Promise<User>;
}
