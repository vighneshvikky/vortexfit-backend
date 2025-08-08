import { SignupDto } from '../dto/auth.dto';
import { LoginDto } from '../dto/login.dto';
import { BaseModel } from 'src/common/model/base-model';

export interface IAuthService {
  signUp(body: SignupDto): Promise<{ message: string; data: { role: string } }>;
  
  verifyLogin(body: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: BaseModel;
  }>;

  initiatePasswordReset(
    email: string,
    role: string,
  ): Promise<{
    message: string;
    data: null;
  }>;

  resetPassword(
    token: string,
    role: string,
    password: string,
  ): Promise<{
    message: string;
    data: { role: string };
  }>;

  rotateRefreshToken(
    oldToken: string,
    role: 'user' | 'trainer' | 'admin',
  ): Promise<{
    accessToken: string;
    newRefreshToken: string;
  }>;

  loginOrRegisterGoogleUser(
    googleUser: { email: string; name: string; googleId: string },
    role: 'user' | 'trainer',
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: BaseModel;
  }>;

  googleLogin(
    code: string,
    role: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: BaseModel;
  }>;

  getUser(id: string): Promise<BaseModel | null>;
}

export const AUTH_SERVICE = Symbol('AuthService');
