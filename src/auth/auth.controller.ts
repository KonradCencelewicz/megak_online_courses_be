import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { RequestWithUser, RequestWithUserDataFromTokenRt } from "./types/type";
import { AuthService } from "./auth.service";
import { CreateUserDto } from '../users/dto/createUser.dto'
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtRtAuthGuard } from "./jwt-rt-auth.guard";
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.register(CreateUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.login(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user);
  }

  @UseGuards(JwtRtAuthGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @Req() req: RequestWithUserDataFromTokenRt,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(req.user, res);
  }
}
