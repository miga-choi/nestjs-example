import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/skip-auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/users.entity';
import { hash } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() _user: User): Promise<any> {
    return this.authService.register(_user);
  }

  // @UseGuards(LocalAuthGuard)
  // @Public()
  // @Post('signin')
  // async signIn(
  //   @GetUser() _user: User,
  //   @Res({ passthrough: true }) _res: Response,
  // ): Promise<any> {
  //   Logger.verbose('AuthController login()');
  //   const { token, ...option } = await this.authService.signIn(_user);
  //   _res.cookie('w_auth', token, option);
  // }

  // @Post('signout')
  // async signOut(@Res({ passthrough: true }) _res: Response) {
  //   const { token, ...option } = await this.authService.signOut();
  //   _res.cookie('w_auth', token, option);
  // }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(
    @GetUser() _user: User,
    @Res({ passthrough: true }) _res: Response,
  ) {
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(_user.id);

    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithJwtRefreshToken(_user.id);

    _user.hashedRefreshToken = await this.usersService.setCurrentRefreshToken(
      refreshToken,
      _user.id,
    );

    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);

    _res
      .cookie('w_auth', accessToken, accessOption)
      .cookie('w_auth_rt', refreshToken, refreshOption);

    return _user;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('signout')
  async signOut(
    @GetUser() _user: User,
    @Res({ passthrough: true }) _res: Response,
  ) {
    const { accessOption, refreshOption } =
      await this.authService.getCookiesForSignOut();

    await this.usersService.removeRefreshToken(_user.id);

    _res
      .cookie('w_auth', '', accessOption)
      .cookie('w_auth_rt', '', refreshOption);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refreshToken(
    @GetUser() _user: User,
    @Res({ passthrough: true }) _res: Response,
  ) {
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(_user.id);

    _res.cookie('w_auth', accessToken, accessOption);
    return _user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@GetUser() _user: User): Promise<User> {
    Logger.verbose('AuthController getProfile');
    return _user;
  }
}
