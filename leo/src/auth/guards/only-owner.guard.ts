import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OnlyOwner implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    const id = params.id || params.userId || params.user_id;

    if (user.id.toString() === id) {
      return true;
    }

    throw new HttpException(
      { success: false, message: [`사용자 본인만 가능한 요청입니다.`] },
      HttpStatus.FORBIDDEN,
    );
  }
}
