import { Lessons } from "../../courses/entity/lessons.entity";
import { ReturnCourse, ReturnLesson } from "../../courses/types/types";
import { Courses } from "../../courses/entity/courses.entity";
import { User } from "../../users/entity/users.entity";
import { ReturnUser } from "../../users/types/type";

export const lessonData = (lesson: Lessons): ReturnLesson => {
  const {id, title, text, slug, imgUrl} = lesson;
  return {id, title, text, slug, imgUrl};
}

export const userData = (user: User): ReturnUser => {
  const { firstName, lastName, email, roles } = user;
  return { firstName, lastName, email, roles };
}

export const coursesData = (courses: Courses): ReturnCourse => {
  const {id, title, description, slug, imgUrl, categories} = courses;

  return {id, title, description, slug, imgUrl, categories};
}