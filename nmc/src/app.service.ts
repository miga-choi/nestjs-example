import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, World!';
  }

  getIanSay(): string {
    return 'Ian: Hello, World!';
  }
}
