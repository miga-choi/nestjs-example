import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/users.entity';

export const GetUser = createParamDecorator(
  (_data, _ctx: ExecutionContext): User => {
    const { user } = _ctx.switchToHttp().getRequest();
    return user;
  },
);
