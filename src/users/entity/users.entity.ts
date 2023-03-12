import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity, OneToOne, JoinColumn
} from "typeorm";
import { v4 as uuid } from 'uuid';
import { Tokens } from "../../auth/entity/tokens.entity";

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 60 })
  firstName: string;

  @Column({ type: "varchar", length: 60 })
  lastName: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", length: 60 })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Tokens, (tokens) => tokens.user)
  @JoinColumn({ name: 'tokensId' })
  tokens: Tokens;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}