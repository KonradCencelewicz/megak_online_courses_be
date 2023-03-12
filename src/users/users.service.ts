import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/users.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { RegisterResponse } from "./types/type";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findUser(email: string): Promise<User> {
    return this.usersRepository.findOneByOrFail({email: email});
  }

  async create(CreateUserDto: CreateUserDto): Promise<RegisterResponse> {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(CreateUserDto.password, salt);

    const { id, firstName, lastName, email } = await this.usersRepository.save({ ...CreateUserDto, password: hashedPassword })

    return { id, firstName, lastName, email };
  }
}
