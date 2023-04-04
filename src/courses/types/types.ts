import { withUsersStamps } from "../../users/types/type";
import { Category } from "../entity/category.entity";
import { Lessons } from "../entity/lessons.entity";

export type CoursesWithLessons = ReturnCourse & {lessons: ReturnLesson[]}

export interface ICourses extends withUsersStamps {
  id: string;
  title: string;
  slug: string;
  description: string;
  imgUrl: string;
  categories: Category[];
  lessons: Lessons[];
  status: boolean;
}

export interface ReturnCourse extends Pick<ICourses, 'id' | 'title' | 'slug' | 'description' | 'imgUrl' | 'categories'>{}

export interface ILessons extends withUsersStamps{
  id: string;
  title: string;
  slug: string;
  text: string;
  imgUrl: string;
  status: boolean;
}

export interface ReturnLesson extends Pick<ILessons, 'id' | 'title' | 'slug' | 'text' | 'imgUrl'> {}

export interface ICategory {
  id: number;
  name: string;
}

export interface withCategories {
  categoriesIds: number[];
}