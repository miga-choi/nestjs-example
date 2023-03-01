import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (_request) => {
          console.log('jwt-refresh-token', _request.signedCookies.w_auth_rt);
          return _request?.signedCookies?.w_auth_rt;
        },
      ]),
      secretOrKey: configService.get<string>('RT_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(_rep, _paylod: any) {
    const hashedRefreshToken = _rep.signedCookies?.w_auth_rt;
    return this.usersService.getUserIfRefreshTokenMatches(
      hashedRefreshToken,
      _paylod.id,
    );
  }
}
