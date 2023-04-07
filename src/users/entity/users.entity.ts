import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany
} from "typeorm";
import { Tokens } from "../../auth/entity/tokens.entity";
import { Roles } from "../../auth/entity/roles.entity";
import { UserInterface } from "../types/type";
import { Courses } from "../../courses/entity/courses.entity";

@Entity({ name: 'users' })
export class User extends BaseEntity implements UserInterface{
  static ROLES_RELATION = 'roles';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 60 })
  firstName: string;

  @Column({ type: "varchar", length: 60 })
  lastName: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Tokens, (tokens) => tokens.user)
  @JoinColumn({ name: 'tokensId' })
  tokens: Tokens;

  @ManyToMany(() => Roles)
  @JoinTable()
  roles: Roles[];

  @OneToMany(() => Courses, (cours) => cours.createdBy)
  courses: Courses[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}