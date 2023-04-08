import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import jwtConfig from "../../config/jwt.configuration";
import { jwtTokenData } from "../types/type";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../users/entity/users.entity";
import { Repository } from "typeorm";
import { ROLES_KEY } from "../roles.decorators";

@Injectable()
export class JwtAtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret_at,
    });
  }

  async validate(payload: jwtTokenData) {
    return await this.usersRepository.findOneOrFail({ where: {id: payload.sub}, relations: ['tokens', ROLES_KEY] });
  }
}
