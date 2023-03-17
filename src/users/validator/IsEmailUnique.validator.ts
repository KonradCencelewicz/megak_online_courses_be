import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "../entity/users.entity";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUnique implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ email: email })
    return !user;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be unique`;
  }
}