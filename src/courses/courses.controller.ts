import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
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

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
  ) {}

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.INSTRUCTOR)
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Req() req: RequestWithUser
  ): Promise<Courses> {
    return this.coursesService.createCourse(createCourseDto, req.user);
  }

  @UseGuards(new RolesGuard(new Reflector()))
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.INSTRUCTOR)
  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  public updateCourse(
    @Param('id') courseId,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: RequestWithUser
  ): Promise<Courses> {
    return this.coursesService.updateCourse(courseId, updateCourseDto, req.user);
  }
}
