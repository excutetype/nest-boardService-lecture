import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    return await this.userRepository.createUser(createUserDto);
  }
}
