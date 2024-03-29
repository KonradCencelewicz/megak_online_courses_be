import { HttpException, HttpStatus, Injectable, StreamableFile } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Courses } from "../courses/entity/courses.entity";
import { User } from "../users/entity/users.entity";
import { join } from "path";
import { createReadStream } from "fs";
import { Response } from "express";
import { HttpHeaders } from "../utils/http/headers";

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Courses) private coursesRepository: Repository<Courses>,
  ) {}

  public async saveCourseImg(courseImg: Omit<Express.Multer.File, 'buffer'>, courseId: string, user: User): Promise<boolean> {
    const course = await this.coursesRepository.findOneOrFail({ where: { id: courseId }, relations: [Courses.CREATOR_RELATION] });

    if(course.createdBy.id !== user.id) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: "Not enough permission!" },
        HttpStatus.UNPROCESSABLE_ENTITY);
    }

    course.imgUrl = courseImg.path;
    await this.coursesRepository.save(course);
    return true;
  }

  public async sendCourseImg(courseId: string, res: Response): Promise<StreamableFile | boolean>  {
    const course = await this.coursesRepository.findOneOrFail({ where: { id: courseId } });
    if(course.imgUrl) {
      const file = createReadStream(join(process.cwd(), course.imgUrl));
      const fileName = course.imgUrl.split(/[\/\\]/).at(-1);
      const fileExtension = course.imgUrl.split('.').at(-1);
      res.set({
        [HttpHeaders.CONTENT_TYPE]: 'image/' + fileExtension,
        [HttpHeaders.CONTENT_DISPOSITION]: `attachment; filename="${fileName}"`,
      });
      return new StreamableFile(file);
    }
    return false;
  }
}
