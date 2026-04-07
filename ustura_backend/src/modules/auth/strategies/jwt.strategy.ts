import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { AppConfigService } from '../../../config/config.service';
import { UserService } from '../../user/user.service';

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
      throw new UnauthorizedException('Access token is invalid.');
    }

    const user = await this.userService.findById(payload.sub);

    if (!user?.isActive) {
      throw new UnauthorizedException('Access token is invalid.');
    }

    return payload;
  }
}
