import { Injectable } from '@nestjs/common';
import { Role } from '../../../shared/auth/role.enum';
import {
  customerCredentialsRequiredError,
  customerGoogleOnlyError,
  customerInactiveError,
  customerOnlyManagedReservationError,
  googleIdentityAlreadyLinkedError,
  invalidEmployeeRoleError,
  passwordRequiredError,
  phoneRequiredError,
} from '../errors/user.errors';
import type { User } from '../interfaces/user.types';
import type { UpdateUserProfileInput } from '../interfaces/user.types';

interface CreateUserRequirementContext {
  role: Role;
  hasPassword: boolean;
  hasFirebaseIdentity: boolean;
  allowPasswordless?: boolean;
  hasPhone: boolean;
  allowEmptyPhone?: boolean;
}

@Injectable()
export class UserAccountPolicy {
  assertCanReuseManagedCustomer(existingUser: User): void {
    if (existingUser.role !== Role.CUSTOMER) {
      throw customerOnlyManagedReservationError();
    }

    if (!existingUser.isActive) {
      throw customerInactiveError();
    }
  }

  assertValidEmployeeRole(role: Role): void {
    if (role !== Role.BARBER && role !== Role.RECEPTIONIST) {
      throw invalidEmployeeRoleError();
    }
  }

  assertCreateUserRequirements(
    context: CreateUserRequirementContext,
  ): void {
    const {
      role,
      hasPassword,
      hasFirebaseIdentity,
      allowPasswordless,
      hasPhone,
      allowEmptyPhone,
    } = context;

    if (role === Role.CUSTOMER) {
      if (!hasPassword && !hasFirebaseIdentity && !allowPasswordless) {
        throw customerCredentialsRequiredError();
      }
    } else if (!hasPassword) {
      throw passwordRequiredError();
    }

    const canOmitPhone = role === Role.CUSTOMER && allowEmptyPhone === true;

    if (!hasPhone && !canOmitPhone) {
      throw phoneRequiredError();
    }
  }

  assertCanLinkFirebaseIdentity(
    user: User,
    normalizedFirebaseUid: string,
  ): void {
    if (user.role !== Role.CUSTOMER) {
      throw customerGoogleOnlyError();
    }

    if (user.firebaseUid && user.firebaseUid !== normalizedFirebaseUid) {
      throw googleIdentityAlreadyLinkedError();
    }
  }

  assertProfileUpdateRequirements(input: UpdateUserProfileInput): void {
    if (input.phone !== undefined && input.phone.length === 0) {
      throw phoneRequiredError();
    }
  }
}
