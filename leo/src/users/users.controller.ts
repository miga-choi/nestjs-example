import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/skip-auth.decorator';
import { OnlyOwner } from 'src/auth/guards/only-owner.guard';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // async create(@Body() _user: User): Promise<User> {
  //   return this.usersService.create(_user);
  // }

  @Public()
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(OnlyOwner)
  @Get(':id')
  findOne(@Param('id') _id: number): Promise<User> {
    return this.usersService.findOne(_id);
  }

  @UseGuards(OnlyOwner)
  @Delete(':id')
  async remove(@Param('id') _id: number): Promise<void> {
    return this.usersService.remove(_id);
  }
}
