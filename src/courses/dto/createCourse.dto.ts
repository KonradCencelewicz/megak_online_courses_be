import { ArrayUnique, IsNotEmpty, Length, Validate } from "class-validator";
import { ICourses, withCategories } from "../types/types";
import { isColumnValueUnique } from "../validator/isColumnValueUnique";

export type CreateCourseDtoType = Pick<ICourses, 'title' | 'description'> & withCategories;

export class CreateCourseDto implements CreateCourseDtoType {
  @IsNotEmpty()
  @Length(1, 100)
  @Validate(isColumnValueUnique)
  title: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Validate(isColumnValueUnique)
  slug: string;

  @IsNotEmpty()
  @Length(1, 1000)
  description: string;

  @ArrayUnique()
  categoriesIds: number[];
}