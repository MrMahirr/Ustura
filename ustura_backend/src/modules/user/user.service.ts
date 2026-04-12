import { Injectable } from '@nestjs/common';
import { DatabaseConstraintViolationError } from '../../database/database.errors';
import { PrincipalKind } from '../../shared/auth/principal-kind.enum';
import { roleToPrincipalKind } from '../../shared/auth/principal-kind.mapper';
import { Role } from '../../shared/auth/role.enum';
import {
  emailAlreadyExistsError,
  phoneAlreadyExistsError,
  userNotFoundError,
} from './errors/user.errors';
import {
  CreateCustomerInput,
  CreateEmployeeInput,
  CreateOwnerInput,
  CreateUserRecordInput,
  User,
  UserProfile,
} from './interfaces/user.types';
import { UserAccountPolicy } from './policies/user-account.policy';
import { UserRepository } from './repositories/user.repository';
import type { SqlQueryExecutor } from '../../database/database.types';
import type {
  UserProvisioningServiceContract,
  UserQueryServiceContract,
} from './interfaces/user.contracts';

@Injectable()
export class UserService
  implements UserQueryServiceContract, UserProvisioningServiceContract
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAccountPolicy: UserAccountPolicy,
  ) {}

  async findByPrincipal(
    kind: PrincipalKind,
    id: string,
  ): Promise<User | null> {
    return this.userRepository.findByPrincipal(kind, id);
  }

  async findByEmailForPrincipal(
    email: string,
    kind: PrincipalKind,
  ): Promise<User | null> {
    return this.userRepository.findByEmailForPrincipal(
      this.normalizeEmail(email),
      kind,
    );
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepository.findByFirebaseUid(firebaseUid.trim());
  }

  async createCustomer(input: CreateCustomerInput): Promise<User> {
    return this.createUser({
      ...input,
      role: Role.CUSTOMER,
    });
  }

  async findOrCreateManagedCustomer(input: {
    name: string;
    email: string;
    phone: string;
  }): Promise<User> {
    const normalizedEmail = this.normalizeEmail(input.email);
    const existingUser = await this.userRepository.findByEmailForPrincipal(
      normalizedEmail,
      PrincipalKind.CUSTOMER,
    );

    if (existingUser) {
      this.userAccountPolicy.assertCanReuseManagedCustomer(existingUser);
      return existingUser;
    }

    return this.createCustomer({
      name: input.name,
      email: normalizedEmail,
      phone: input.phone,
      allowPasswordless: true,
    });
  }

  async createEmployee(
    input: CreateEmployeeInput,
    executor?: SqlQueryExecutor,
  ): Promise<User> {
    this.userAccountPolicy.assertValidEmployeeRole(input.role);

    return this.createUser(input, executor);
  }

  async createOwner(
    input: CreateOwnerInput,
    executor?: SqlQueryExecutor,
  ): Promise<User> {
    return this.createUser(
      {
        ...input,
        role: Role.OWNER,
      },
      executor,
    );
  }

  async deactivateUser(
    kind: PrincipalKind,
    id: string,
  ): Promise<UserProfile> {
    const user = await this.userRepository.deactivate(kind, id);

    if (!user) {
      throw userNotFoundError();
    }

    return this.toProfile(user);
  }

  async linkFirebaseCustomerIdentity(
    id: string,
    firebaseUid: string,
  ): Promise<User> {
    const user = await this.userRepository.findByPrincipal(
      PrincipalKind.CUSTOMER,
      id,
    );

    if (!user) {
      throw userNotFoundError();
    }

    const normalizedFirebaseUid = firebaseUid.trim();
    this.userAccountPolicy.assertCanLinkFirebaseIdentity(
      user,
      normalizedFirebaseUid,
    );

    if (user.firebaseUid === normalizedFirebaseUid) {
      return user;
    }

    const linkedUser = await this.userRepository.linkFirebaseIdentity(
      id,
      normalizedFirebaseUid,
    );

    if (!linkedUser) {
      throw userNotFoundError();
    }

    return linkedUser;
  }

  private async createUser(
    input: CreateUserRecordInput,
    executor?: SqlQueryExecutor,
  ): Promise<User> {
    const normalizedEmail = this.normalizeEmail(input.email);
    const normalizedPhone = this.normalizePhone(input.phone);
    const normalizedFirebaseUid = this.normalizeFirebaseUid(input.firebaseUid);
    const hasPassword = this.hasCredential(input.passwordHash);
    const hasFirebaseIdentity = this.hasCredential(normalizedFirebaseUid);
    this.userAccountPolicy.assertCreateUserRequirements({
      role: input.role,
      hasPassword,
      hasFirebaseIdentity,
      allowPasswordless: input.allowPasswordless,
      hasPhone: normalizedPhone.length > 0,
      allowEmptyPhone: input.allowEmptyPhone,
    });

    const principalKind = roleToPrincipalKind(input.role);
    const existingUser = await this.userRepository.findByEmailForPrincipal(
      normalizedEmail,
      principalKind,
      executor,
    );

    if (existingUser) {
      throw emailAlreadyExistsError();
    }

    if (normalizedPhone.length > 0) {
      const existingPhoneUser = await this.userRepository.findByPhoneForPrincipal(
        normalizedPhone,
        principalKind,
        executor,
      );

      if (existingPhoneUser) {
        throw phoneAlreadyExistsError();
      }
    }

    try {
      return await this.userRepository.create(
        {
          ...input,
          email: normalizedEmail,
          name: input.name.trim(),
          phone: normalizedPhone,
          firebaseUid: normalizedFirebaseUid,
          passwordHash: hasPassword ? input.passwordHash!.trim() : null,
        },
        executor,
      );
    } catch (error) {
      if (
        error instanceof DatabaseConstraintViolationError &&
        (error.constraint === 'uq_users_phone_non_empty' ||
          error.constraint?.includes('phone'))
      ) {
        throw phoneAlreadyExistsError();
      }

      if (
        error instanceof DatabaseConstraintViolationError &&
        (error.constraint === 'users_email_key' ||
          error.constraint === 'uq_customers_lower_email' ||
          error.constraint === 'uq_personnel_lower_email' ||
          error.constraint === 'uq_platform_admins_lower_email')
      ) {
        throw emailAlreadyExistsError();
      }

      throw error;
    }
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizePhone(phone?: string): string {
    return phone?.trim() ?? '';
  }

  private normalizeFirebaseUid(firebaseUid?: string | null): string | null {
    const normalizedValue = firebaseUid?.trim();
    return normalizedValue ? normalizedValue : null;
  }

  private hasCredential(value?: string | null): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private toProfile(user: User): UserProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
