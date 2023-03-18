import { User } from "../../users/entity/users.entity";
import { Roles } from "../../auth/entity/roles.entity";

export const checkIfUserHasRole = (user: User, role: Roles) => {
  return user.roles.some(userRole => userRole.role === role.role);
}