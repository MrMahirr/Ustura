import { Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../../shared/auth/jwt-payload.interface';
import { Role } from '../../../shared/auth/role.enum';
import { OwnerApplicationStatus } from '../enums/owner-application-status.enum';
import {
  ownerApplicationAlreadyReviewedError,
  platformAdminAccessForbiddenError,
} from '../errors/platform-admin.errors';
import type { OwnerApplicationRecord } from '../interfaces/platform-admin.types';

@Injectable()
export class PlatformAdminPolicy {
  assertCanManageOwnerApplications(currentUser: JwtPayload): void {
    if (currentUser.role !== Role.SUPER_ADMIN) {
      throw platformAdminAccessForbiddenError();
    }
  }

  assertPendingApplication(application: OwnerApplicationRecord): void {
    if (application.status !== OwnerApplicationStatus.PENDING) {
      throw ownerApplicationAlreadyReviewedError(application.status);
    }
  }
}
