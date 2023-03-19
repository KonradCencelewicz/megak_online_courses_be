import { withUsersStamps } from "../../users/types/type";
import { Category } from "../entity/category.entity";

export interface ICourses extends withUsersStamps{
  id: string;
  title: string;
  slug: string;
  description: string;
  imgUrl: string;
  categories: Category[];
  status: boolean;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface withCategories {
  categoriesIds: number[];
}