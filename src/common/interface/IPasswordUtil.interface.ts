
export const PASSWORD_UTIL = Symbol('PASSWORD_UTIL');

export interface IPasswordUtil {
  hashPassword(plain: string): Promise<string>;
  comparePassword(plain: string, hashed: string): Promise<boolean>;
}
