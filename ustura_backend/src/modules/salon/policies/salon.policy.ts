import { Injectable } from '@nestjs/common';
import { Role } from '../../../shared/auth/role.enum';
import type { JwtPayload } from '../../../shared/auth/jwt-payload.interface';
import type { Salon } from '../interfaces/salon.types';
import { salonManagementForbiddenError } from '../errors/salon.errors';

@Injectable()
export class SalonPolicy {
  assertCanManage(currentUser: JwtPayload): void {
    if (currentUser.role !== Role.OWNER) {
      throw salonManagementForbiddenError('Only owners can manage salons.');
    }
  }

  assertCanManageSalon(
    currentUser: JwtPayload,
    salon: Pick<Salon, 'ownerId'>,
  ): void {
    this.assertCanManage(currentUser);

    if (salon.ownerId !== currentUser.sub) {
      throw salonManagementForbiddenError(
        'You do not have permission to manage this salon.',
      );
    }
  }
}
