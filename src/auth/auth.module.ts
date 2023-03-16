import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from './auth.controller';
import { JwtAtStrategy, JwtRtStrategy } from "./strategies";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entity/users.entity";
import { Tokens } from "./entity/tokens.entity";
import { Roles } from "./entity/roles.entity";
import { UsersModule } from "../users/users.module";

@Module({
  providers: [UsersModule, AuthService, LocalStrategy, JwtAtStrategy, JwtRtStrategy],
  imports: [PassportModule, JwtModule.register({}), TypeOrmModule.forFeature([User, Tokens, Roles])],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
