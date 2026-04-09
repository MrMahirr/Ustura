import { Injectable } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import type { User } from '../../user/interfaces/user.types';
import {
  staffAlreadyAssignedError,
  staffInvalidAccountRoleError,
  staffManagementForbiddenError,
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
}
