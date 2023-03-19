import {
  BaseEntity,
  Column, Entity,
  ManyToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ICategory } from "../types/types";
import { Courses } from "./courses.entity";

@Entity()
export class Category extends BaseEntity implements ICategory {
  static ID_COLUMN = 'id';
  static NAME_COLUMN = 'name';

  static COURSES_RELATION = 'courses';

  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({type: 'varchar', length: 100, unique: true, name: 'name'})
  name: string;

  @ManyToMany(() => Courses)
  courses: Courses[];
}