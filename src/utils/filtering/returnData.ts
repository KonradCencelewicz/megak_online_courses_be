import { Lessons } from "../../courses/entity/lessons.entity";
import { ReturnCourse, ReturnLesson } from "../../courses/types/types";
import { Courses } from "../../courses/entity/courses.entity";

export const lessonData = (lesson: Lessons): ReturnLesson => {
  const {id, title, text, slug, imgUrl} = lesson;
  return {id, title, text, slug, imgUrl};
}

export const coursesData = (courses: Courses): ReturnCourse => {
  const {id, title, description, slug, imgUrl, categories} = courses;

  return {id, title, description, slug, imgUrl, categories};
}