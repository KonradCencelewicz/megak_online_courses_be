import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn, Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ILessons } from "../types/types";
import { User } from "../../users/entity/users.entity";
import { Courses } from "./courses.entity";

@Entity()
export class Lessons extends BaseEntity implements ILessons {
  static ID_COLUMN = 'id';
  static TITLE_COLUMN = 'title';
  static SLUG_COLUMN = 'slug';
  static TEXT_COLUMN = 'text';
  static IMG_URL_COLUMN = 'imgUrl';
  static STATUS_COLUMN = 'status';
  static CREATED_AT_COLUMN = 'createdAt';
  static UPDATED_AT_COLUMN = 'updatedAt';
  static DELETED_AT_COLUMN = 'deletedAt';
  static CREATED_BY_COLUMN = 'createdBy';
  static UPDATED_BY_COLUMN = 'updatedBy';
  static DELETED_BY_COLUMN = 'deletedBy';

  static CATEGORIES_RELATION = 'courses';
  static CREATOR_RELATION = 'createdBy';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 100})
  title: string;

  @Column({type: 'varchar', length: 100, unique: true})
  slug: string;

  @Column({type: 'longtext'})
  text: string;

  @Column()
  imgUrl: string;

  @Column({ type:'boolean', name: 'status' })
  status: boolean;

  @ManyToOne(() => Courses, (course) => course.lessons)
  course: Courses

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 36 })
  updatedBy: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ type: 'varchar', length: 36 })
  deletedBy: string | null;

}