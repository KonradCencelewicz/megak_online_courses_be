import { Global, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/users.entity";
import { UsersController } from './users.controller';
import { Roles } from "../auth/entity/roles.entity";
import { IsEmailUnique } from "./validator/IsEmailUnique.validator";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Roles])],
  providers: [UsersService, IsEmailUnique],
  exports: [UsersService, IsEmailUnique],
  controllers: [UsersController],
})
export class UsersModule {}
