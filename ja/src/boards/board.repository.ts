import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  async getAllBoards(_user: User): Promise<Board[]> {
    // return this.find();
    const query = this.createQueryBuilder('boards');

    query.where('boards.userId = :userId', { userId: _user.id });

    const boards = await query.getMany();
    return boards;
  }

  async getBoardById(_id: number): Promise<Board> {
    const board = this.findOne(_id);
    if (!board) {
      throw new NotFoundException(`Can't find Board with id: ${_id}`);
    }
    return board;
  }

  async createBoard(
    _createBoardDto: CreateBoardDto,
    _user: User,
  ): Promise<Board> {
    const { title, description } = _createBoardDto;

    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user: _user,
    });

    await this.save(board);
    return board;
  }

  async deleteBoard(_id: number, _user: User): Promise<void> {
    const result = await this.delete({ id: _id, user: _user });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id: ${_id}`);
    }
  }

  async updateBoardStatus(_id: number, _status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(_id);

    board.status = _status;
    await this.save(board);

    return board;
  }
}
