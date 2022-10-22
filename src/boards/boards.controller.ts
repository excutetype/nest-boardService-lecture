import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './entities/board.entity';
import { BoardStatus } from './model/board-status.enum';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  constructor(private boardsService: BoardsService) {}
  private logger = new Logger('BoardsController');

  @Get()
  async getBoardAll(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying get to all boards.`);
    return await this.boardsService.getBoardAll(user);
  }

  @Get('/:id')
  async getBoardById(@Param('id') id: number): Promise<Board> {
    return await this.boardsService.getBoardById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(`User ${user.username} creating a new board.
    Payload: ${JSON.stringify(createBoardDto)}`);
    return await this.boardsService.createBoard(createBoardDto, user);
  }

  @Patch('/:id')
  updateBoardStatus(
    @Param('id') id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return this.boardsService.updateBoardStatus(id, status);
  }

  @Delete('/:id')
  async deleteBoard(@Param('id') id: number): Promise<void> {
    return await this.boardsService.deleteBoard(id);
  }
}
