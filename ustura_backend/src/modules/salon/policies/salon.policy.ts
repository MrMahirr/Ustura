import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import type { Salon } from '../interfaces/salon.types';

@Injectable()
export class SalonPolicy {
  assertCanManage(currentUser: JwtPayload): void {
    if (currentUser.role !== Role.OWNER) {
      throw new ForbiddenException('Only owners can manage salons.');
    }
  }

  assertCanManageSalon(
    currentUser: JwtPayload,
    salon: Pick<Salon, 'ownerId'>,
  ): void {
    this.assertCanManage(currentUser);

    if (salon.ownerId !== currentUser.sub) {
      throw new ForbiddenException(
        'You do not have permission to manage this salon.',
      );
    }
  }
}
