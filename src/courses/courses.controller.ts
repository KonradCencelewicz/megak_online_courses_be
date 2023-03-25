import {
  Body,
  Controller, DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param, ParseIntPipe,
  Patch,
  Post, Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RolesGuard } from "../auth/roles.guard";
import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorators";
import { RoleEnum } from "../auth/enums/role.enum";
import { CoursesService } from "./courses.service";
import { CreateCourseDto } from "./dto/createCourse.dto";
import { Courses } from "./entity/courses.entity";
import { RequestWithUser } from "../auth/types/type";
import { UpdateCourseDto } from "./dto/updateCourse.dto";
import { Pagination } from "nestjs-typeorm-paginate";

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
  ) {}

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Get('/')
  public viewCourses(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<Courses>> {
    return this.coursesService.viewCourses(page, limit);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.INSTRUCTOR)
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: RequestWithUser,
  ): Promise<Courses> {
    return this.coursesService.createCourse(createCourseDto, req.user);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public viewCourse(
    @Param('id') courseId,
  ): Promise<Courses> {
    return this.coursesService.viewCourse(courseId);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.INSTRUCTOR)
  @Patch('/:id')
  public updateCourse(
    @Param('id') courseId,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: RequestWithUser
  ): Promise<Courses> {
    return this.coursesService.updateCourse(courseId, updateCourseDto, req.user);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.INSTRUCTOR)
  @Delete('/:id')
  public deleteCourse(
    @Param('id') courseId,
    @Req() req: RequestWithUser
  ): Promise<boolean> {
    return this.coursesService.deleteCourse(courseId, req.user);
  }
}
