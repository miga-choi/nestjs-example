import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // ************************************ CREATE ************************************ //
  async create(_user: User): Promise<User> {
    const user = this.usersRepository.create(_user);
    const result = await this.usersRepository.save(user);
    return result;
  }

  // ************************************ READ ************************************ //
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(_id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: _id });
  }

  findByUsername(_username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username: _username });
  }

  async findById(_id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: _id });
    if (user) {
      return user;
    }
    throw new HttpException(
      `User does not exist with id: ${_id}`,
      HttpStatus.NOT_FOUND,
    );
  }

  // ************************************ DELETE ************************************ //
  async remove(_id: number): Promise<void> {
    await this.usersRepository.delete(_id);
  }

  // ************************************ JWT Token ************************************ //
  async setCurrentRefreshToken(_refreshToken: string, _id: number) {
    const hashedRefreshToken = await hash(_refreshToken, 10);
    await this.usersRepository.update(_id, {
      hashedRefreshToken: hashedRefreshToken,
    });
    return hashedRefreshToken;
  }

  async getUserIfRefreshTokenMatches(_refreshToken: string, _id: number) {
    const user = await this.findById(_id);

    const isRefreshTokenMatching = await compare(
      _refreshToken,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(id: number) {
    return this.usersRepository.update(id, { hashedRefreshToken: null });
  }
}
