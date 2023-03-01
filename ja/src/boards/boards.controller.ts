import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger(`BoardsController`);

  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  getAllBoards(@GetUser() _user: User): Promise<Board[]> {
    this.logger.verbose(`User ${_user.username} trying to get all boards`);
    return this.boardsService.getAllBoards(_user);
  }

  // @Get('/')
  // getAllBoard(): Board[] {
  //     return this.boardsService.getAllBoards();
  // }

  @UsePipes(ValidationPipe)
  @Post()
  createBoard(
    @Body() _createBoardDto: CreateBoardDto,
    @GetUser() _user: User,
  ): Promise<Board> {
    this.logger.verbose(
      `User ${_user.username} creating a new board. Payload: ${JSON.stringify(
        _createBoardDto,
      )}`,
    );
    return this.boardsService.createBoard(_createBoardDto, _user);
  }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createBoard(
  //     @Body() createBoardDto: CreateBoardDto
  // ): Board {
  //     return this.boardsService.createBoard(createBoardDto);
  // }

  @Get('/:id')
  getBoardById(@Param('id', ParseIntPipe) _id: number): Promise<Board> {
    return this.boardsService.getBoardById(_id);
  }

  // @Get('/:id')
  // getBoardById(@Param('id') id: string): Board {
  //     return this.boardsService.getBoardById(id)
  // }

  @Delete(':id')
  deleteBoard(
    @Param('id', ParseIntPipe) _id: number,
    @GetUser() _user: User,
  ): Promise<void> {
    return this.boardsService.deleteBoard(_id, _user);
  }

  // @Delete('/:id')
  // deleteBoard(@Param('id') id: string): void {
  //     this.boardsService.deleteBoard(id);
  // }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) _id: number,
    @Body('status', BoardStatusValidationPipe) _status: BoardStatus,
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(_id, _status);
  }

  // @Patch('/:id/status')
  // updateBoardStatus(
  //     @Param('id') id: string,
  //     @Body('status', BoardStatusValidationPipe) status: BoardStatus
  // ) {
  //     return this.boardsService.updateBoardStatus(id, status);
  // }
}
