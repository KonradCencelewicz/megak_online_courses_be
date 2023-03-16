export const matchRoles = (requiredRoles: string[], userRoles: string[]) => {
  let validate = false;
  userRoles.forEach(role => {
    if (userRoles.includes(role)) {
      validate = true;
    }
  })
  return validate;
};