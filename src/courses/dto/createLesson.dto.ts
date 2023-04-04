import { IsNotEmpty, Length, Validate } from "class-validator";
import { ILessons } from "../types/types";
import { isColumnValueUnique } from "../validator/isColumnValueUnique";

export type CreateLessonDtoType = Pick<ILessons, 'title' | 'text' | 'slug'>;

export class CreateLessonDto implements CreateLessonDtoType {
  @IsNotEmpty()
  @Length(1, 100)
  @Validate(isColumnValueUnique)
  title: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Validate(isColumnValueUnique)
  slug: string;

  @IsNotEmpty()
  @Length(1)
  text: string;

}