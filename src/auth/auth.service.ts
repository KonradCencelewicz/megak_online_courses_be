import { ForbiddenException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/createUser.dto";
import { User } from "../users/entity/users.entity";
import { jwtTokenDataRt, Tokens as TokensType } from "./types/type";
import { RegisterResponse, ReturnUser } from "../users/types/type";
import jwtConfiguration from "../config/jwt.configuration";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tokens } from "./entity/tokens.entity";
import { compareHashValue, hashValue } from "../utils/hashed/hashed";
import { userData } from "../utils/filtering/returnData";
import { Request, Response } from 'express';

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

    const checkPassword = await compareHashValue(user.password, pass);

    if(!checkPassword) {
      return null;
    }

    return user;
  }

  async login(user: User, res: Response): Promise<TokensType & { user: ReturnUser }> {
    const { access_token, refresh_token, cookie } = await this.getTokens(user.email, user.id);
    //TODO fixit: first time (when authorize user we should load roles)
    const userWithRoles = await this.usersRepository.findOneOrFail({
      where:
        { id: user.id },
      relations: [User.ROLES_RELATION]
    })

    await this.updateRefreshTokenHash(user.id, refresh_token);
    res.setHeader('Set-Cookie', [cookie])

    return {
      access_token,
      user: userData(userWithRoles),
    }
  }

  async logout(user: User): Promise<any> {
    const tokenToDelete = user.tokens.id;
    user.tokens = null;
    await this.usersRepository.save(user);
    await this.tokensRepository.delete(tokenToDelete);
    return true;
  }

  async register(CreateUserDto: CreateUserDto): Promise<RegisterResponse> {
    return await this.usersService.create(CreateUserDto);
  }

  async refreshTokens(userData: jwtTokenDataRt, res: Response): Promise<any> {
    const user = await this.usersRepository.findOneOrFail({ where: { id: userData.sub }, relations: ['tokens'] });

    if(user.tokens === null) {
      throw new ForbiddenException('Access denied');
    }

    const rtmatches = await compareHashValue(user.tokens.refresh_token, userData.refreshToken);

    if(!rtmatches) {
      throw new ForbiddenException('Access denied');
    }

    return await this.login(user, res)
  }

  async authenticated(req: Request): Promise<boolean> {
    const { Refresh } = req.cookies;
    if (Refresh !== undefined) {
      return true;
    }
    return false;
  }

  private async getTokens(email: string, userId: string) {
    const payload = { username: email, sub: userId };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ ...payload }, {expiresIn: jwtConfiguration.at_time, secret: jwtConfiguration.secret_at}),
      this.jwtService.signAsync({ ...payload }, {expiresIn: jwtConfiguration.rt_time, secret: jwtConfiguration.secret_rt}),
    ]);

    const cookie = `Refresh=${refresh_token}; HttpOnly; Path=/; Max-Age=${jwtConfiguration.rt_time}`;

    return {
      access_token,
      refresh_token,
      cookie,
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
