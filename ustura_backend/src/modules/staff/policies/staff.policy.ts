import { Injectable } from '@nestjs/common';
import { Role } from '../../../shared/auth/role.enum';
import type { JwtPayload } from '../../../shared/auth/jwt-payload.interface';
import type { User } from '../../user/interfaces/user.types';
import {
  staffAlreadyAssignedError,
  staffInvalidAccountRoleError,
  staffManagementForbiddenError,
  staffProvisioningModeInvalidError,
  staffSelfViewForbiddenError,
  staffUserInactiveError,
} from '../errors/staff.errors';
import type { StaffMember } from '../interfaces/staff.types';

@Injectable()
export class StaffPolicy {
  assertCanManageSalonStaff(
    currentUser: JwtPayload,
    salonOwnerId: string,
  ): void {
    if (currentUser.role !== Role.OWNER || currentUser.sub !== salonOwnerId) {
      throw staffManagementForbiddenError();
    }
  }

  assertCanAssignUserToRole(
    user: Pick<User, 'role' | 'isActive'>,
    staffRole: Role.BARBER | Role.RECEPTIONIST,
  ): void {
    if (!user.isActive) {
      throw staffUserInactiveError();
    }

    if (user.role !== staffRole) {
      throw staffInvalidAccountRoleError();
    }
  }

  assertCanCreate(existingStaffMember: StaffMember | null): void {
    if (existingStaffMember?.isActive) {
      throw staffAlreadyAssignedError();
    }
  }

  assertValidProvisioningSelection(input: {
    userId?: string;
    employee?: object;
  }): void {
    const hasUserId = typeof input.userId === 'string' && input.userId.trim().length > 0;
    const hasEmployee = input.employee !== undefined;

    if (hasUserId === hasEmployee) {
      throw staffProvisioningModeInvalidError();
    }
  }

  assertCanViewOwnAssignments(currentUser: JwtPayload): void {
    if (
      currentUser.role !== Role.BARBER &&
      currentUser.role !== Role.RECEPTIONIST
    ) {
      throw staffSelfViewForbiddenError();
    }
  }
}
