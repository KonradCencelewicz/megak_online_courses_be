import { jwtTokenData, jwtTokenDataRt } from "../../auth/types/type";
import { User } from "../entity/users.entity";

export interface UserInterface extends withUsersDatesStamps{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
}

export interface withUsersStamps extends withUsersDatesStamps, withUsersIdStamps {}

export interface withUsersDatesStamps {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface withUsersIdStamps {
  createdBy: User;
  updatedBy: string;
  deletedBy: string | null;
}

export interface withUserDataFromToken {
  user: jwtTokenData;
}

export interface withUserDataFromTokenRt {
  user: jwtTokenDataRt;
}

export interface withUser {
  user: User;
}

export interface withUserDataIdEmail {
  user: UserDataIdUsername;
}

export interface UserDataIdUsername {
  userId: string
  username: string;
}

export type RegisterResponse = Omit<UserInterface , 'password' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isActive'>;