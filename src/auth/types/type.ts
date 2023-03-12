import { withUserDataFromToken, withUserDataFromTokenRt, withUser, withUserDataIdEmail } from "../../users/types/type";

export interface TokensEntity extends Tokens{
  id: string;
}

export interface Tokens {
  refresh_token: string;
  access_token: string;
}

export interface RequestWithUser extends Request, withUser {}
export interface RequestWithUserDataFromToken extends Request, withUserDataFromToken {}
export interface RequestWithUserDataIdEmail extends Request, withUserDataIdEmail {}
export interface RequestWithUserDataFromTokenRt extends Request, withUserDataFromTokenRt {}

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