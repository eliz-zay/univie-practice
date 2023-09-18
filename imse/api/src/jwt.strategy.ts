import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import * as entities from '@/entity';
import * as services from '@/service';

export type LoggedInRequest = Request & { user: entities.User };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(services.UserService) private readonly userService: services.UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'secret',
    });
  }

  async validate(payload: { id: string }): Promise<entities.User> {
    const user = await this.userService.getUserIfExists(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
