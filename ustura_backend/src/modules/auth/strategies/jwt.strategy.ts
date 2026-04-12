import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../../../shared/auth/jwt-payload.interface';
import { AppConfigService } from '../../../config/config.service';
import {
  USER_QUERY_SERVICE,
  type UserQueryServiceContract,
} from '../../user/interfaces/user.contracts';
import { accessTokenInvalidError } from '../errors/auth.errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: AppConfigService,
    @Inject(USER_QUERY_SERVICE)
    private readonly userQueryService: UserQueryServiceContract,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (payload.tokenType !== 'access') {
      throw accessTokenInvalidError();
    }

    const user = await this.userQueryService.findById(payload.sub);

    if (!user?.isActive) {
      throw accessTokenInvalidError();
    }

    return payload;
  }
}
