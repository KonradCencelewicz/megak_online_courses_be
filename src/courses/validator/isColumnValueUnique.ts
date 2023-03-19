import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courses } from "../entity/courses.entity";

@ValidatorConstraint({ async: true })
@Injectable()
export class isColumnValueUnique implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Courses) private coursesRepository: Repository<Courses>,
  ) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    const { property, object } = args;
    const id = (object as Courses).id !== undefined ? (object as Courses).id : null;

    if(id) {
      const course = await this.coursesRepository.findOneBy({ id });
      return !(value === course[property]);
    } else {
      const course = await this.coursesRepository.findOneBy({ [property]: value });
      return !!!course;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `Property ${args.property} should be unique. We have this ${args.property}`;
  }
}