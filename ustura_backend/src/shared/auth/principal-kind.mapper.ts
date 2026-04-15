import { PrincipalKind } from './principal-kind.enum';
import { Role } from './role.enum';

export function roleToPrincipalKind(role: Role): PrincipalKind {
  switch (role) {
    case Role.CUSTOMER:
      return PrincipalKind.CUSTOMER;
    case Role.SUPER_ADMIN:
      return PrincipalKind.PLATFORM_ADMIN;
    default:
      return PrincipalKind.PERSONNEL;
  }
}
