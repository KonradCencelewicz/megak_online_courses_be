import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { assignUserRoleDto } from "./dto/assignRole.dto";
import { RolesGuard } from "../auth/roles.guard";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorators";
import { RoleEnum } from "../auth/enums/role.enum";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Post('assignRoles')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() assignUserRoleDto: assignUserRoleDto) {
    return this.userService.assignRole(assignUserRoleDto);
  }
}
