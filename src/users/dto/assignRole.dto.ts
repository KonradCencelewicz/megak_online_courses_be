import { IsNotEmpty } from "class-validator";
import { RoleEnum } from "../../auth/enums/role.enum";

type AvailableRole = RoleEnum.STUDENT | RoleEnum.INSTRUCTOR | RoleEnum.ADMIN;

export class assignUserRoleDto {
  @IsNotEmpty()
  roles: AvailableRole[];

  @IsNotEmpty()
  userId: string;
}