import { withUser } from "../../users/types/type";

export interface RequestWithUser extends Request, withUser {}

export interface LoginResponse {
  access_token: string;
}

export interface jwtTokenData {
  username: string;
  sub: string;
  iat: Date;
  exp: Date;
}