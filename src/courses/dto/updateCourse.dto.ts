import { CreateCourseDto } from "./createCourse.dto";
import { IsNotEmpty, Length, Validate } from "class-validator";
import { isColumnValueUnique } from "../validator/isColumnValueUnique";

export class UpdateCourseDto extends CreateCourseDto {
  @IsNotEmpty()
  @Validate(isColumnValueUnique)
  id: string

  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @IsNotEmpty()
  @Length(1, 100)
  slug: string;
}