import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity, OneToOne, JoinColumn, ManyToMany, JoinTable
} from "typeorm";
import { Tokens } from "../../auth/entity/tokens.entity";
import { Roles } from "../../auth/entity/roles.entity";

@Entity({ name: 'users' })
export class User extends BaseEntity {
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}