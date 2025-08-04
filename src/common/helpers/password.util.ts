import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  static async hashPassword(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 10);
  }

  static async comparePassword(
    plain: string,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
 