import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/users.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { RegisterResponse } from "./types/type";
import { hashValue } from "../utils/hashed/hashed";
import { Roles } from "../auth/entity/roles.entity";
import { RoleEnum } from "../auth/enums/role.enum";


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
  ) {}

  async findUser(email: string): Promise<User> {
    return this.usersRepository.findOneByOrFail({email: email});
  }

  async create(CreateUserDto: CreateUserDto): Promise<RegisterResponse> {
    const hashedPassword = await hashValue(CreateUserDto.password);
    //TODO change it to event when student is created assign student role
    const studentRole = await this.rolesRepository.findOneOrFail({ where: { role: RoleEnum.STUDENT } });

    const user = new User();
    user.firstName = CreateUserDto.firstName;
    user.lastName = CreateUserDto.lastName;
    user.email = CreateUserDto.email;
    user.password = hashedPassword;
    user.roles = [studentRole];
    const {id, firstName, lastName, email} = await this.usersRepository.save(user);

    return { id, firstName, lastName, email };
  }
}
