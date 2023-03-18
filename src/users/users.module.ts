import { Global, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/users.entity";
import { UsersController } from './users.controller';
import { Roles } from "../auth/entity/roles.entity";
import { IsEmailUnique } from "./validator/IsEmailUnique.validator";
import { UsersRolesService } from "./usersRoles.service";
import { Courses } from "../courses/entity/courses.entity";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Roles, Courses])],
  providers: [UsersService, UsersRolesService, IsEmailUnique],
  exports: [UsersService, IsEmailUnique],
  controllers: [UsersController],
})
export class UsersModule {}
