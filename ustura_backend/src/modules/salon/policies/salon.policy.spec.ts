import { ForbiddenException } from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { SalonPolicy } from './salon.policy';

function createUser(overrides: Partial<JwtPayload> = {}): JwtPayload {
  return {
    sub: 'owner-1',
    email: 'owner@example.com',
    role: Role.OWNER,
    tokenType: 'access',
    ...overrides,
  };
}

describe('SalonPolicy', () => {
  let policy: SalonPolicy;

  beforeEach(() => {
    policy = new SalonPolicy();
  });

  it('rejects non-owner users from salon management actions', () => {
    expect(() =>
      policy.assertCanManage(
        createUser({
          role: Role.CUSTOMER,
        }),
      ),
    ).toThrow(ForbiddenException);
  });

  it('rejects owners managing salons they do not own', () => {
    expect(() =>
      policy.assertCanManageSalon(createUser(), {
        ownerId: 'owner-2',
      }),
    ).toThrow('You do not have permission to manage this salon.');
  });

  it('allows owners to manage their own salons', () => {
    expect(() =>
      policy.assertCanManageSalon(createUser(), {
        ownerId: 'owner-1',
      }),
    ).not.toThrow();
  });
});
