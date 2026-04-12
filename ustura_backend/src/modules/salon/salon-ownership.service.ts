import { Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';
import {
  salonInactiveUpdateForbiddenError,
  salonNotFoundError,
} from './errors/salon.errors';
import type { Salon, UpdateSalonInput } from './interfaces/salon.types';
import { SalonPolicy } from './policies/salon.policy';
import { SalonRepository } from './repositories/salon.repository';

@Injectable()
export class SalonOwnershipService {
  constructor(
    private readonly salonRepository: SalonRepository,
    private readonly salonPolicy: SalonPolicy,
  ) {}

  async requireOwnedSalon(
    currentUser: JwtPayload,
    salonId: string,
  ): Promise<Salon> {
    const salon = await this.salonRepository.findById(salonId);

    if (!salon) {
      throw salonNotFoundError();
    }

    this.salonPolicy.assertCanManageSalon(currentUser, salon);
    return salon;
  }

  assertCanUpdate(existingSalon: Salon, updateInput: UpdateSalonInput): void {
    if (existingSalon.isActive) {
      return;
    }

    const updateKeys = Object.keys(updateInput);

    if (
      updateKeys.length === 0 ||
      (updateKeys.length === 1 && updateInput.isActive === true)
    ) {
      return;
    }

    throw salonInactiveUpdateForbiddenError();
  }
}
