import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { AppConfigService } from '../../../config/config.service';
import { UserService } from '../../user/user.service';
import { accessTokenInvalidError } from '../errors/auth.errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: AppConfigService,
    private readonly userService: UserService,
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

    const user = await this.userService.findById(payload.sub);

    if (!user?.isActive) {
      throw accessTokenInvalidError();
    }

    return payload;
  }
}
