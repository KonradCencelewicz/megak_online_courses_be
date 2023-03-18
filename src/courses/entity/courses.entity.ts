import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn, Entity, ManyToMany, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { ICourses } from '../types/types';
import { User } from "../../users/entity/users.entity";
import { Category } from "./category.entity";

@Entity()
export class Courses extends BaseEntity implements ICourses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar', length: 100, unique: true})
  title: string;

  @Column({type: 'varchar', length: 100, unique: true})
  slug: string;

  @Column({type: 'varchar', length: 1000})
  description: string;

  @Column()
  imageUrl: string;

  @Column({ type:'boolean' })
  status: boolean;

  @ManyToMany(() => Category)
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.courses)
  creator: User;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 36 })
  updatedBy: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ type: 'varchar', length: 36 })
  deletedBy: string | null;
}