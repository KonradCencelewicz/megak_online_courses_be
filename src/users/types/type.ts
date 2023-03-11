import { User } from "../users.entity";

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface withUser {
  user: User;
}

export type RegisterResponse = Omit<UserInterface , 'password' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isActive'>