import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './entities/board.entity';
import { BoardStatus } from './model/board-status.enum';

@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardRepository) {}

  async getBoardById(id: number): Promise<Board> {
    const board = await this.boardRepository.findOneBy({ id });

    if (!board) {
      throw new NotFoundException(`Can not find Board with id ${id}`);
    }

    return board;
  }

  async getBoardAll(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    return await this.boardRepository.createBoard(createBoardDto, user);
  }

  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Can not find Board with id ${id}`);
    }
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);

    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }
}
