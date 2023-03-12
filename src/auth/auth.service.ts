import { ForbiddenException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { User } from "../users/entity/users.entity";
import { jwtTokenDataRt, Tokens as TokensType } from "./types/type";
import { RegisterResponse, UserDataIdUsername } from "../users/types/type";
import jwtConfiguration from "../config/jwt.configuration";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tokens } from "./entity/tokens.entity";
import { hashValue } from './../utils/hashed/hashed'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Tokens) private tokensRepository: Repository<Tokens>,
  ) {
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findUser(email);

    const checkPassword = await bcrypt.compare(pass, user.password);

    if(!checkPassword) {
      return null;
    }

    return user;
  }

  async login(user: User): Promise<TokensType> {
    const { access_token, refresh_token } = await this.getTokens(user.email, user.id);
    await this.updateRefreshTokenHash(user.id, refresh_token);

    return {
      access_token,
      refresh_token
    }
  }

  async logout(userData: UserDataIdUsername): Promise<any> {
    const user = await this.usersRepository.findOneOrFail({ where: { id: userData.userId }, relations: ['tokens'] });
    const tokenToDelete = user.tokens.id;
    user.tokens = null;
    await this.usersRepository.save(user);
    await this.tokensRepository.delete(tokenToDelete);
    return true;
  }

  async register(CreateUserDto: CreateUserDto): Promise<RegisterResponse> {
    return await this.usersService.create(CreateUserDto);
  }

  async refreshTokens(userData: jwtTokenDataRt): Promise<any> {
    const user = await this.usersRepository.findOneOrFail({ where: { id: userData.sub }, relations: ['tokens'] });

    if(user.tokens === null) {
      throw new ForbiddenException('Access denied');
    }

    const rtmatches = await bcrypt.compare(userData.refreshToken, user.tokens.refresh_token);

    if(!rtmatches) {
      throw new ForbiddenException('Access denied');
    }

    return await this.login(user)
  }

  private async getTokens(email: string, userId: string) {
    const payload = { username: email, sub: userId };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ ...payload }, {expiresIn: 60 * 15, secret: jwtConfiguration.secret_at}),
      this.jwtService.signAsync({ ...payload }, {expiresIn: 60 * 60 * 24 * 7, secret: jwtConfiguration.secret_rt}),
    ]);

    return {
      access_token,
      refresh_token
    }
  }

  private async updateRefreshTokenHash(userId: string, rt: string): Promise<void> {
    const hashedRt = await hashValue(rt);

    const user = await this.usersRepository.findOneOrFail({where: {id: userId}, relations: ['tokens']});

    const tokenToDelete = user.tokens?.id || null;

    user.tokens = await this.createNewRefreshToken(hashedRt);
    await this.usersRepository.save(user);

    if(tokenToDelete) {
      await this.tokensRepository.delete(tokenToDelete);
    }
  }

  private async createNewRefreshToken(hashedRt: string): Promise<Tokens> {
    const newRefreshToken = new Tokens();
    newRefreshToken.refresh_token = hashedRt;
    return await this.tokensRepository.save(newRefreshToken);
  }
}
