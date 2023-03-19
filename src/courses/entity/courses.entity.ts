import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ICourses } from '../types/types';
import { User } from "../../users/entity/users.entity";
import { Category } from "./category.entity";

@Entity()
export class Courses extends BaseEntity implements ICourses {
  static ID_COLUMN = 'id';
  static TITLE_COLUMN = 'title';
  static SLUG_COLUMN = 'slug';
  static DESCRIPTION_COLUMN = 'description';
  static IMG_URL_COLUMN = 'imgUrl';
  static STATUS_COLUMN = 'status';
  static CREATED_AT_COLUMN = 'createdAt';
  static UPDATED_AT_COLUMN = 'updatedAt';
  static DELETED_AT_COLUMN = 'deletedAt';
  static CREATED_BY_COLUMN = 'createdBy';
  static UPDATED_BY_COLUMN = 'updatedBy';
  static DELETED_BY_COLUMN = 'deletedBy';

  static CATEGORIES_RELATION = 'categories';
  static CREATOR_RELATION = 'creator';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 100, unique: true })
  title: string;

  @Column({type: 'varchar', length: 100, unique: true})
  slug: string;

  @Column({type: 'varchar', length: 1000})
  description: string;

  @Column()
  imgUrl: string;

  @Column({ type:'boolean', name: 'status' })
  status: boolean;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];


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