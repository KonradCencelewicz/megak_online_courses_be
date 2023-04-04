import {
  Controller, Get,
  Param,
  Post, Req, Res,
  UploadedFile, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptionConfig } from "../config/multerOption.config";
import { UploadsService } from "./uploads.service";
import { RolesGuard } from "../auth/roles.guard";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorators";
import { RoleEnum } from "../auth/enums/role.enum";
import { RequestWithUser } from "../auth/types/type";
import { Response } from "express";

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService
  ) {}

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.INSTRUCTOR)
  @Post('courses/:id')
  @UseInterceptors(FileInterceptor('courseImg', multerOptionConfig))
  async uploadCourseFile(
    @Param('id') courseId: string,
    @UploadedFile() courseImg: Omit<Express.Multer.File, 'buffer'>,
    @Req() req: RequestWithUser,
  ) {
    return await this.uploadsService.saveCourseImg(courseImg, courseId, req.user);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Get('courses/:id/img')
  async downloadCourseImg(
    @Param('id') courseId: string,
    @Res({ passthrough: true } ) res: Response,
  ) {
    return this.uploadsService.sendCourseImg(courseId, res);
  }
}
