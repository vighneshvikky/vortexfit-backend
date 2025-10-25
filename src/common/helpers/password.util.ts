import * as bcrypt from 'bcrypt';
import { IPasswordUtil } from '../interface/IPasswordUtil.interface';

export class PasswordUtil implements IPasswordUtil {
  async hashPassword(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 10);
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
