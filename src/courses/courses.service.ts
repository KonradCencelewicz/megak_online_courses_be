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
import { CreateLessonDto } from "./dto/createLesson.dto";
import { Lessons } from "./entity/lessons.entity";
import { UpdateLessonDto } from "./dto/updateLesson.dto";
import { lessonData } from "../utils/filtering/returnData";
import { CoursesWithLessons, ReturnLesson } from "./types/types";

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(Courses) private coursesRepository: Repository<Courses>,
    @InjectRepository(Lessons) private lessonsRepository: Repository<Lessons>,
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

  public async viewCourse(courseId: string): Promise<CoursesWithLessons> {
    try {
      const {id, title, slug, imgUrl, description, categories, lessons} = await this.coursesRepository.findOneOrFail({
        where: { [Courses.ID_COLUMN]: courseId },
        relations: [
          Courses.LESSONS_RELATION,
          Courses.CATEGORIES_RELATION
        ],
        order: {
          [Courses.LESSONS_RELATION]: {
            [Courses.CREATED_AT_COLUMN] : 'ASC'
          }
        }
      });

      const lessonsData = lessons.map(lessonData);

      return {id, title, slug, imgUrl, description, categories, lessons: lessonsData};

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

  public async createLesson(courseId: string, createLessonDto: CreateLessonDto, user: User): Promise<boolean> {
    try {
      const course = await this.coursesRepository.findOneOrFail({
        where: { [Courses.ID_COLUMN]: courseId },
        relations: [Courses.LESSONS_RELATION]
      });

      const lesson = new Lessons();
      this.setUpLesson(lesson, createLessonDto, user);
      lesson.status = true;
      lesson.createdBy = user;

      await this.lessonsRepository.save(lesson);
      course.lessons = [...course.lessons, lesson];
      await this.coursesRepository.save(course);
    } catch (e) {
      throw new HttpException(
        { status: HttpStatus.UNPROCESSABLE_ENTITY, error: "Something went wrong" },
        HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return true;
  }

  public async updateLesson(courseId: string, lessonId: string, updateLessonDto: UpdateLessonDto, user: User): Promise<boolean> {
    try {
      const course = await this.coursesRepository.findOneOrFail({ where: { [Courses.ID_COLUMN]: courseId } });
      const lesson = await this.lessonsRepository.findOneOrFail({ where: { [Lessons.ID_COLUMN]: lessonId } });

      this.setUpLesson(lesson, updateLessonDto, user);

      await this.lessonsRepository.save(lesson);
      course.lessons.push(lesson);
      await this.coursesRepository.save(course);
    } catch (e) {
      throw new HttpException(
        { status: HttpStatus.UNPROCESSABLE_ENTITY, error: "Something went wrong" },
        HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return true;
  }

  public async deleteLesson(lessonId, user: User): Promise<boolean> {
    try {
      const lesson = await this.lessonsRepository.findOneOrFail({ where: { id: lessonId }, relations: [Lessons.CREATOR_RELATION]});

      if (user.id === lesson.createdBy.id) {
        await this.coursesRepository.delete(lesson.id);
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

  public async viewLesson(lessonId: string): Promise<ReturnLesson> {
    try {
      const lesson = await this.lessonsRepository.findOneOrFail({
        where: { [Courses.ID_COLUMN]: lessonId },
      });

      return lessonData(lesson);
    } catch (e) {
      throw new HttpException(
        { status: HttpStatus.UNPROCESSABLE_ENTITY, error: "Lessons with this id doesn't exist!" },
        HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private async setUpCourse(course: Courses, data: CreateCourseDto, user: User) {
    const { title, description, slug, categoriesIds } = data;

    const categories = await this.categoryRepository.findBy({ id: In(categoriesIds) });

    course.title = title;
    course.slug = slug;
    course.description = description;
    course.categories = categories;
    course.updatedBy = user.id;
  }

  private setUpLesson(lesson: Lessons, data: CreateLessonDto, user: User) {
    const { title, text, slug } = data;

    lesson.title = title;
    lesson.slug = slug;
    lesson.text = text;
    lesson.updatedBy = user.id;
  }
}
