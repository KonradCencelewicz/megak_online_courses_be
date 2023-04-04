import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entity/users.entity";
import { Courses } from "./entity/courses.entity";
import { Category } from "./entity/category.entity";
import { isColumnValueUnique } from "./validator/isColumnValueUnique";
import { Lessons } from "./entity/lessons.entity";

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, isColumnValueUnique],
  imports: [TypeOrmModule.forFeature([User, Courses, Category, Lessons])]
})
export class CoursesModule {}
