import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./dto/createCourse.dto";
import { Courses } from "./entity/courses.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Category } from "./entity/category.entity";
import { User } from "../users/entity/users.entity";
import { UpdateCourseDto } from "./dto/updateCourse.dto";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import { Order } from "../utils/filtering/filtering";

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(Courses) private coursesRepository: Repository<Courses>,
  ) {}

  public async createCourse(createCourseDto: CreateCourseDto, user: User): Promise<Courses> {
    const course = new Courses();
    await this.setUpCourse(course, createCourseDto, user)
    course.createdBy = user;

    return await this.coursesRepository.save(course);
  }

  public async viewCourses(page: number, limit: number): Promise<Pagination<Courses>> {
    const options: IPaginationOptions = {
      limit,
      page
    }

    const courses = this.coursesRepository.createQueryBuilder('courses');
    courses.orderBy(Courses.CREATED_AT_COLUMN, Order.DESC);
    return paginate<Courses>(courses, options);
  }

  public async viewCourse(courseId: string): Promise<Courses> {
    try {
      return await this.coursesRepository.findOneOrFail({ where: { [Courses.ID_COLUMN]: courseId } });
    } catch (e) {
      throw new HttpException(
        { status: HttpStatus.UNPROCESSABLE_ENTITY, error: "Course with this id doesn't exist!" },
        HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  public async updateCourse(courseId, updateCourseDto: UpdateCourseDto, user: User): Promise<Courses> {
    try {
      const course = await this.coursesRepository.findOneByOrFail({ id: courseId });

      await this.setUpCourse(course, updateCourseDto, user)

      return await this.coursesRepository.save(course);
    } catch (e) {
      throw new HttpException(
        { status: HttpStatus.UNPROCESSABLE_ENTITY, error: "Course with this id doesn't exist!" },
        HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  public async deleteCourse(courseId, user: User): Promise<boolean> {
    try {
      const course = await this.coursesRepository.findOneOrFail({ where: { id: courseId }, relations: [Courses.CREATOR_RELATION]});

      if (user.id === course.createdBy.id) {
        await this.coursesRepository.delete(course.id);
        return true;
      } else {
        throw new Error();
      }
    } catch (e) {
      throw new HttpException(
        { status: HttpStatus.UNPROCESSABLE_ENTITY, error: "You are not owner of this course or course doesn't exist any more!" },
        HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private async setUpCourse(course: Courses, data: CreateCourseDto, user: User) {
    const { title, description, imgUrl, slug, categoriesIds } = data;

    const categories = await this.categoryRepository.findBy({ id: In(categoriesIds) });

    course.title = title;
    course.slug = slug;
    course.description = description;
    course.imgUrl = imgUrl;
    course.categories = categories;
    course.updatedBy = user.id;
  }
}
