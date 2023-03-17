import { Roles } from "../entity/roles.entity";

export const matchRoles = (requiredRoles: string[], userRoles: Roles[]) => {
  let validate = false;
  userRoles.forEach(role => {
    if (requiredRoles.includes(role.role)) {
      validate = true;
    }
  })
  return validate;
};