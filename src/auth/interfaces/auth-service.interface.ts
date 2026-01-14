import { SignupDto } from '../dto/auth.dto';
import { LoginDto } from '../dto/login.dto';
import { BaseModel } from 'src/common/model/base-model';
import { SetupMfaResponse, VerifyLoginResponse, VerifyMfaLoginResponse, VerifyMfaSetupResponse } from './api.response.interface';

export interface IAuthService {
  signUp(body: SignupDto): Promise<{ message: string; data: { role: string } }>;



  verifyLogin(body: LoginDto): Promise<VerifyLoginResponse>;

  initiatePasswordReset(
    email: string,
    role: string,
  ): Promise<{
    message: string;
    data: null;
  }>;

  setupMfa(userId: string, role: string): Promise<SetupMfaResponse>;

  verifyMfaSetup(userId: string, otp: string, role: string): Promise<VerifyMfaSetupResponse>;

  verifyMfaLogin(userId: string, otp: string, role: string): Promise<VerifyMfaLoginResponse>;

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
    id: string,
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
   accessToken?: string; 
  refreshToken?: string; 
  user?: BaseModel;
  mfaRequired?: boolean;
  mfaSetupRequired?: boolean;
  userId?: string;
  message?: string;
  }>;

  getUser(id: string): Promise<BaseModel | null>;
}

export const AUTH_SERVICE = Symbol('AuthService');
