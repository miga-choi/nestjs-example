import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) _authCredentialDto: AuthCredentialDto,
  ): Promise<User> {
    return this.authService.signUp(_authCredentialDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) _authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(_authCredentialDto);
  }

  @UseGuards(AuthGuard())
  @Post('/test')
  authTest(@GetUser() _user: User) {
    console.log(_user);
  }
}
