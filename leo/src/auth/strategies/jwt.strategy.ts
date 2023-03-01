import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (_request) => {
          console.log('jwt-access-token', _request.signedCookies.w_auth);
          return _request?.signedCookies?.w_auth;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('AT_JWT_SECRET'),
    });
  }

  async validate(_payload: { id: number; username: string }): Promise<User> {
    Logger.verbose('JwtStrategy validate()');
    return this.userService.findById(_payload.id);
  }
}
