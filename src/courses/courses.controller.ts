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
import { CreateLessonDto } from "./dto/createLesson.dto";
import { UpdateLessonDto } from "./dto/updateLesson.dto";
import { CoursesWithLessons, ReturnLesson } from "./types/types";

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
  ) {}

  @Get('/categories')
  public viewCategoies() {
    return this.coursesService.viewCategories();
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Patch('/:courseid/lesson/:id')
  public viewLesson(
    @Param('id') lessonId,
  ): Promise<ReturnLesson> {
    return this.coursesService.viewLesson(lessonId);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.INSTRUCTOR)
  @Patch('/:courseid/lesson/:id')
  public updateLesson(
    @Body() updateLessonDto: UpdateLessonDto,
    @Param('id') lessonId,
    @Param('courseid') courseId,
    @Req() req: RequestWithUser
  ): Promise<boolean> {
    return this.coursesService.updateLesson(courseId, lessonId, updateLessonDto, req.user);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.INSTRUCTOR)
  @Post('/:id/lesson')
  public createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @Param('id') courseId,
    @Req() req: RequestWithUser
  ): Promise<boolean> {
    return this.coursesService.createLesson(courseId, createLessonDto, req.user);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.INSTRUCTOR)
  @Delete('/:courseId/lesson/:id')
  public deleteLesson(
    @Param('id') lessonId,
    @Req() req: RequestWithUser
  ): Promise<boolean> {
    return this.coursesService.deleteLesson(lessonId, req.user);
  }

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
  ): Promise<CoursesWithLessons> {
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
