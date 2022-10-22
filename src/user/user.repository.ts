import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import { CryptoUtil } from 'src/util/crypto.util';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;

    const salt = CryptoUtil.generateSalt(32);
    const digest = await CryptoUtil.pbkdf2(password, salt);

    const user = this.create({ username, password: String(digest), salt });

    try {
      await this.save(user);
    } catch (e) {
      //유니크 키 제약 조건 위반 에러코드
      if (e.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
