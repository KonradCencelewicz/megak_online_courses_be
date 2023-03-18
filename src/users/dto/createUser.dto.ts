import { IsEmail, IsNotEmpty, Length, Validate } from "class-validator";
import { IsEmailUnique } from "../validator/IsEmailUnique.validator";

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 60)
  firstName: string;

  @IsNotEmpty()
  @Length(1, 60)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Validate(IsEmailUnique)
  email: string;

  @IsNotEmpty()
  @Length(8, 60)
  password: string;
}