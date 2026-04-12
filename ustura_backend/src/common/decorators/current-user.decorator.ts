import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../../shared/auth/jwt-payload.interface';

interface AuthenticatedRequest {
  user?: JwtPayload;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
