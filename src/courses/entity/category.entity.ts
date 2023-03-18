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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 100, unique: true})
  name: string;

  @ManyToMany(() => Courses)
  courses: Courses[];
}