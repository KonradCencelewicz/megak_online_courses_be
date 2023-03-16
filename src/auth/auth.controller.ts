import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./local-auth.guard";
import { RequestWithUser, RequestWithUserDataFromTokenRt } from "./types/type";
import { AuthService } from "./auth.service";
import { CreateUserDto } from '../users/dto/createUser.dto'
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtRtAuthGuard } from "./jwt-rt-auth.guard";

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
  login(@Req() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user);
  }

  @UseGuards(JwtRtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@Req() req: RequestWithUserDataFromTokenRt ) {
    return this.authService.refreshTokens(req.user);
  }
}
