import * as argon2 from "argon2";

export const hashValue = async (value: string): Promise<string> => {
  return await argon2.hash(value);
}

export const compareHashValue = async (hashedValue: string, value: string): Promise<boolean> => {
  return await argon2.verify(hashedValue, value);
}
