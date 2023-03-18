import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { assignUserRoleDto } from "./dto/assignRole.dto";
import { RolesGuard } from "../auth/roles.guard";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorators";
import { RoleEnum } from "../auth/enums/role.enum";
import { UsersRolesService } from "./usersRoles.service";

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly userRolesService: UsersRolesService,
  ) {}

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Post('assignRoles')
  @HttpCode(HttpStatus.CREATED)
  async assignRoles(@Body() assignUserRoleDto: assignUserRoleDto) {
    return this.userRolesService.assignRoles(assignUserRoleDto);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Post('assignRoles/:roleName/user/:userId')
  @HttpCode(HttpStatus.CREATED)
  async assignRole(
    @Param('roleName') roleName: string,
    @Param('userId') userId: string,
  ) {
    return this.userRolesService.assignRole(roleName, userId);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete('assignRoles/:roleName/user/:userId')
  async deleteRole(
    @Param('roleName') roleName: string,
    @Param('userId') userId: string,
  ) {
    return this.userRolesService.deleteRole(roleName, userId);
  }
}
