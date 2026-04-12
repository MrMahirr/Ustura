import type { SqlQueryExecutor } from '../../../database/database.types';
import type {
  CreateCustomerInput,
  CreateEmployeeInput,
  CreateOwnerInput,
  User,
  UserProfile,
} from './user.types';

export const USER_QUERY_SERVICE = Symbol('USER_QUERY_SERVICE');

export interface UserQueryServiceContract {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
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
  deactivateUser(id: string): Promise<UserProfile>;
  linkFirebaseCustomerIdentity(id: string, firebaseUid: string): Promise<User>;
}
