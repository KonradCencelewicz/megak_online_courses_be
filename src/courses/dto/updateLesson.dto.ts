import { IsNotEmpty, Length, Validate } from "class-validator";
import { isColumnValueUnique } from "../validator/isColumnValueUnique";
import { CreateLessonDto } from "./createLesson.dto";

export class UpdateLessonDto extends CreateLessonDto {
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