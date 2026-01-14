import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import Redis from 'ioredis';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import {
  IUSEREPOSITORY,
  IUserRepository,
} from 'src/user/interfaces/user-repository.interface';
import {
  ITRAINEREPOSITORY,
  ITrainerRepository,
} from 'src/trainer/interfaces/trainer-repository.interface';
import { IJwtTokenService } from './interfaces/ijwt-token-service.interface';
import { BaseModel } from 'src/common/model/base-model';
import {
  IUserService,
  USER_SERVICE,
} from 'src/user/interfaces/user-service.interface';
import {
  ITrainerService,
  TRAINER_SERVICE,
} from 'src/trainer/interfaces/trainer-service.interface';
import {
  IMailService,
  MAIL_SERVICE,
} from 'src/common/helpers/mailer/mail-service.interface';
import { IAuthService } from './interfaces/auth-service.interface';
import { AUTH_SERVICE_REGISTRY } from './interfaces/auth-service-registry.interface';
import { UserRoleServiceRegistry } from 'src/common/services/user-role-service.registry';
import { IOtpService, OTP_SERVICE } from './interfaces/otp-service.interface';
import { SignupDto } from './dto/auth.dto';
import speakeasy from 'speakeasy';
import QrCode from 'qrcode';

import {
  IPasswordUtil,
  PASSWORD_UTIL,
} from 'src/common/interface/IPasswordUtil.interface';
import { User } from '@/user/schemas/user.schema';
import { SetupMfaResponse, VerifyLoginResponse, VerifyMfaLoginResponse, VerifyMfaSetupResponse } from './interfaces/api.response.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE) private _userService: IUserService,
    @Inject(TRAINER_SERVICE) private _trainerService: ITrainerService,
    @Inject(IJwtTokenService) private readonly _jwtService: IJwtTokenService,
    @Inject(MAIL_SERVICE) private readonly _mailService: IMailService,
    @Inject(IUSEREPOSITORY) private readonly _userRepo: IUserRepository,
    @Inject(AUTH_SERVICE_REGISTRY)
    private readonly _roleServiceRegistry: UserRoleServiceRegistry,
    @Inject(ITRAINEREPOSITORY)
    private readonly _trainerRepo: ITrainerRepository,
    @Inject('REDIS_CLIENT') private readonly _redis: Redis,
    @Inject(OTP_SERVICE) private readonly _otpService: IOtpService,
    @Inject(PASSWORD_UTIL) private readonly _passwordUtil: IPasswordUtil,
  ) {}

  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  private readonly logger = new Logger(AuthService.name);

  async signUp(data: SignupDto) {
    const { role, email, password } = data;

    const userRepo = role === 'trainer' ? this._trainerRepo : this._userRepo;

    const existing = await userRepo.findByEmail(email);
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hashPassword = await this._passwordUtil.hashPassword(password);

    const tempUser = {
      ...data,
      password: hashPassword,
    };

    await this._redis.set(
      `temp_${role}:${email}`,
      JSON.stringify(tempUser),
      'EX',
      300,
    );

    const otp = await this._otpService.generateOtp(email);
    await this._mailService.sendOtp(email, otp);

    return {
      message: 'OTP sent to your email',
      data: {
        email,
        role,
      },
    };
  }

  // ✅ FIXED: Check mfaEnabled property correctly
  async verifyLogin(body: LoginDto): Promise<VerifyLoginResponse> {
    const userRepo = this._roleServiceRegistry.getRepoByRole(body.role);

    const user = await userRepo.findAuthUserByEmail(body.email);

    console.log('user data from vighnesh', user);

    console.log('LOGIN USER DATA:', {
      id: user!._id,
      email: user!.email,
      mfaEnabled: user!.mfaEnabled,
      mfaSecret: !!user!.mfaSecret,
      mfaTempSecret: user!.mfaTempSecret,
      typeOfMfaEnabled: typeof user!.mfaEnabled,
    });

    if (
      !user ||
      typeof user.password !== 'string' ||
      typeof user._id === 'undefined'
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this._passwordUtil.comparePassword(
      body.password,
      user.password,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }

    if (user.mfaTempSecret && !user.mfaEnabled) {
      return {
        mfaSetupRequired: true,
        userId: user._id.toString(),
        message: 'Complete MFA setup',
      };
    }


    if (user.mfaEnabled === true && user.mfaSecret) {
      return {
        mfaRequired: true,
        userId: user._id.toString(),
        message: 'MFA verification required',
      };
    }

    return {
      mfaSetupRequired: true,
      userId: user._id.toString(),
      message: 'MFA setup required',
    };
  }

  async setupMfa(userId: string, role: string): Promise<SetupMfaResponse> {
    const userService = this._roleServiceRegistry.getServiceByRole(role);
    const userRepo = this._roleServiceRegistry.getRepoByRole(role);

    const user = await userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.mfaEnabled && user.mfaSecret) {
      throw new BadRequestException('MFA is already enabled for this user');
    }

    const secret = speakeasy.generateSecret({ name: `MyApp (${user.email})` });

    // Store in temporary field
    await userRepo.updateById(userId, { mfaTempSecret: secret.base32 });

    const qrCode = await QrCode.toDataURL(secret.otpauth_url);

    return { qrCode, manualKey: secret.base32 };
  }

  async verifyMfaSetup(userId: string, otp: string, role: string): Promise<VerifyMfaSetupResponse> {
    const userRepo = this._roleServiceRegistry.getRepoByRole(role);
    const user = await userRepo.findById(userId);

    if (!user || !user.mfaTempSecret) {
      throw new BadRequestException('MFA setup not initiated');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.mfaTempSecret,
      encoding: 'base32',
      token: otp,
      window: 1,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    // const recoveryCodes = Array.from({ length: 5 }).map(() =>
    //   Math.random().toString(36).substring(2, 10).toUpperCase(),
    // );

    // ✅ Move temp secret to permanent secret and enable MFA
    await userRepo.updateById(userId, {
      mfaSecret: user.mfaTempSecret,
      mfaTempSecret: null, // Clear temp secret
      mfaEnabled: true, // Enable MFA
      // recoveryCodes,
    });

    return {
      message: 'MFA enabled successfully',
      // recoveryCodes,
    };
  }

  async verifyMfaLogin(userId: string, otp: string, role: string): Promise<VerifyMfaLoginResponse> {
    const userRepo = this._roleServiceRegistry.getRepoByRole(role);
    const user = await userRepo.findById(userId);

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      throw new BadRequestException('MFA not enabled');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: otp,
      window: 1,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    const accessToken = this._jwtService.signAccessToken({
      sub: userId,
      role: user.role,
      isBlocked: false,
    });

    const refreshToken = this._jwtService.signRefreshToken({
      sub: userId,
      role: user.role,
      isBlocked: false,
    });

    return { accessToken, refreshToken, user };
  }

  async initiatePasswordReset(email: string, role: string) {
    const userService = this._roleServiceRegistry.getServiceByRole(role);
    const user = await userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this._jwtService.signPasswordResetToken({
      sub: user._id.toString(),
      role: user.role,
      isBlocked: false,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}&role=${role}`;

    await this._mailService.sendResetLink(user.email, resetUrl);

    return {
      message: 'Password reset link sent to your email',
      data: null,
    };
  }

  async resetPassword(token: string, role: string, password: string) {
    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const payload = this._jwtService.verifyPasswordResetToken(token);

    const userId = payload.sub;

    const hashedPassword = await this._passwordUtil.hashPassword(password);

    const userService = this._roleServiceRegistry.getServiceByRole(role);
    await userService.updatePassword(userId, hashedPassword);

    return {
      message: 'Password has been reset successfully',
      data: { role },
    };
  }

  async rotateRefreshToken(
    oldToken: string,
    role: 'user' | 'trainer' | 'admin',
    userId: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    const accessToken = this._jwtService.signAccessToken({
      sub: userId,
      role: role,
      isBlocked: false,
    });

    const newRefreshToken = this._jwtService.signRefreshToken({
      sub: userId,
      role,
      isBlocked: false,
    });

    return { accessToken, newRefreshToken };
  }

  async loginOrRegisterGoogleUser(
    googleUser: { email: string; name: string; googleId: string },
    role: 'user' | 'trainer',
  ) {
    let user;
    const refreshTokenTTL = 7 * 24 * 60 * 60;
    if (role === 'trainer') {
      user = await this._trainerService.findByEmail(googleUser.email);

      if (!user) {
        user = await this._trainerRepo.create({
          name: googleUser.name,
          email: googleUser.email,
          role: 'trainer',
          isVerified: false,
          isBlocked: false,
          googleId: googleUser.googleId,
          provider: 'google',
        });
      }
    } else if (role === 'user') {
      user = await this._userService.findByEmail(googleUser.email);
      if (!user) {
        user = await this._userRepo.create({
          name: googleUser.name,
          email: googleUser.email,
          role: 'user',
          isVerified: false,
          isBlocked: false,
          googleId: googleUser.googleId,
          provider: 'google',
        });
      }
    }

    const accessToken = this._jwtService.signAccessToken({
      sub: user._id,
      role: user.role,
      isBlocked: false,
    });
    const refreshToken = this._jwtService.signRefreshToken({
      sub: user._id,
      role: user.role,
      isBlocked: false,
    });
    await this._redis.set(
      refreshToken,
      user._id.toString(),
      'EX',
      refreshTokenTTL,
    );

    return { accessToken, refreshToken, user };
  }



  async googleLogin(
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
  }> {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const id_token = tokenRes.data.id_token;

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) throw new Error('Invalid Google token payload');

    const { email, name, picture, sub: googleId } = payload;

    if (!email || !name || !googleId) {
      throw new Error('No data found from payload');
    }

    if (role !== 'trainer' && role !== 'user') {
      throw new Error('Invalid role');
    }

    // Find or create user
    let user;
    const userService = this._roleServiceRegistry.getServiceByRole(role);
    const userRepo = this._roleServiceRegistry.getRepoByRole(role);

    user = await userRepo.findAuthUserByEmail(email);

    if (!user) {
      // Create new user
      user = await userRepo.create({
        name,
        email,
        role,
        isVerified: false,
        isBlocked: false,
        googleId,
        provider: 'google',
        image: picture,
        mfaEnabled: false, // New users don't have MFA yet
      });
    }

    console.log('user', user);

    // ✅ CHECK MFA STATUS - Same logic as regular login

    // If user has incomplete MFA setup
    if (user.mfaTempSecret && !user.mfaEnabled) {
      return {
        mfaSetupRequired: true,
        userId: user._id.toString(),
        message: 'Complete MFA setup',
      };
    }

    // If MFA is enabled, require verification
    if (user.mfaEnabled === true && user.mfaSecret) {
      return {
        mfaRequired: true,
        userId: user._id.toString(),
        message: 'MFA verification required',
      };
    }

    // If MFA not enabled, require setup
    return {
      mfaSetupRequired: true,
      userId: user._id.toString(),
      message: 'MFA setup required',
    };
  }

  async getUser(id: string) {
    return this._trainerRepo.findById(id);
  }
}
