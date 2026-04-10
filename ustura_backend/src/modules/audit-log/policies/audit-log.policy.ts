import { ForbiddenException, Injectable } from '@nestjs/common';
import type { JwtPayload } from '../../../shared/auth/jwt-payload.interface';
import { Role } from '../../../shared/auth/role.enum';

@Injectable()
export class AuditLogPolicy {
  assertCanList(currentUser: JwtPayload): void {
    if (currentUser.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Forbidden resource');
    }
  }
}
