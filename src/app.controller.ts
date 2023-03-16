import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { RolesGuard } from "./auth/roles.guard";
import { Roles } from "./auth/roles.decorators";
import { Role } from "./auth/enums/role.enum";
import { Reflector } from "@nestjs/core";

@Controller()
export class AppController {

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return 'Hello World';
  }

}
