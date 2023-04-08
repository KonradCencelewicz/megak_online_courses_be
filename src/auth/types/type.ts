import { withUserDataFromToken, withUserDataFromTokenRt, withUser, withUserDataIdEmail } from "../../users/types/type";
import { Request } from 'express';

export interface TokensEntity extends Tokens{
  id: string;
}

export interface Tokens {
  access_token: string;
}

export interface RequestWithUser extends Omit<Request, 'user'>, withUser {}
export interface RequestWithUserDataFromToken extends Omit<Request, 'user'>, withUserDataFromToken {}
export interface RequestWithUserDataIdEmail extends Omit<Request, 'user'>, withUserDataIdEmail {}
export interface RequestWithUserDataFromTokenRt extends Omit<Request, 'user'>, withUserDataFromTokenRt {}

export interface jwtTokenData {
  username: string;
  sub: string;
  iat: Date;
  exp: Date;
}

export interface jwtTokenDataRt extends jwtTokenData, RefreshToken{}

export interface RefreshToken {
  refreshToken: string;
}