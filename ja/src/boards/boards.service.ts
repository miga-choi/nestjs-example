import { Injectable } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private readonly boardRepository: BoardRepository,
  ) {}

  getAllBoards(_user: User): Promise<Board[]> {
    return this.boardRepository.getAllBoards(_user);
  }

  // getAllBoards(): Board[] {
  //     return this.boards;
  // }

  createBoard(_createBoardDto: CreateBoardDto, _user: User): Promise<Board> {
    return this.boardRepository.createBoard(_createBoardDto, _user);
  }

  // createBoard(createBoardDto: CreateBoardDto) {
  //     const { title, description } = createBoardDto;

  //     const board: Board = {
  //         id: uuid(),
  //         title,
  //         description,
  //         status: BoardStatus.PUBLIC
  //     }

  //     this.boards.push(board);
  //     return board;
  // }

  getBoardById(_id: number): Promise<Board> {
    return this.boardRepository.getBoardById(_id);
  }

  // getBoardById(id: string): Board {
  //     const found = this.boards.find((board) => board.id === id);

  //     if (!found) {
  //         throw new NotFoundException(`Can't find Board with id ${id}`);
  //     }

  //     return found;
  // }

  deleteBoard(_id: number, _user: User): Promise<void> {
    return this.boardRepository.deleteBoard(_id, _user);
  }

  // deleteBoard(id: string): void {
  //     const found = this.getBoardById(id);
  //     this.boards = this.boards.filter((board) => board.id !== found.id);
  // }

  updateBoardStatus(_id: number, _status: BoardStatus): Promise<Board> {
    return this.boardRepository.updateBoardStatus(_id, _status);
  }

  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //     const board = this.getBoardById(id);
  //     board.status = status;
  //     return board;
  // }
}
