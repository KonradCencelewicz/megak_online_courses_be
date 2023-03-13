import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity, OneToOne, JoinColumn
} from "typeorm";
import { v4 as uuid } from 'uuid';
import { User } from "../../users/entity/users.entity";

@Entity({ name: 'tokens' })
export class Tokens extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  refresh_token: string;

  @OneToOne(() => User, (user) => user.tokens)
  user: User
}