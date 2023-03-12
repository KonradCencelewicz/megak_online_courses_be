import * as bcrypt from "bcrypt";

export const hashValue = async (value: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(value, salt);
}