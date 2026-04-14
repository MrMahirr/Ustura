import { Injectable } from '@nestjs/common';

import { cannotSelfDeactivateAdminUserError, userNotFoundError } from './errors/user.errors';
import type { AdminUserSummary, UpdateUserProfileInput } from './interfaces/user.types';
import { UserRepository } from './repositories/user.repository';
import { UserAdminQueryService } from './user-admin-query.service';

@Injectable()
export class UserAdminManagementService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAdminQueryService: UserAdminQueryService,
  ) {}

  async setManagedUserActive(
    actorPrincipalId: string,
    targetUserId: string,
    isActive: boolean,
  ): Promise<AdminUserSummary> {
    if (!isActive && actorPrincipalId === targetUserId) {
      throw cannotSelfDeactivateAdminUserError();
    }

    const updated = await this.userRepository.adminSetManagedUserActive(
      targetUserId,
      isActive,
    );

    if (!updated) {
      throw userNotFoundError();
    }

    return this.userAdminQueryService.findAdminUserById(targetUserId);
  }

  async updateManagedUserProfile(
    targetUserId: string,
    input: UpdateUserProfileInput,
  ): Promise<AdminUserSummary> {
    const updated = await this.userRepository.adminUpdateUserProfile(
      targetUserId,
      input,
    );

    if (!updated) {
      throw userNotFoundError();
    }

    return this.userAdminQueryService.findAdminUserById(targetUserId);
  }
}
