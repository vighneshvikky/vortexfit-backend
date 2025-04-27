import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from 'src/user/services/user.service';
import { LoginDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from './jwt.service';
import { User } from '../interface/user-interface';
import { Response } from 'express';
import { adminLoginDto } from '../dto/adminLogin.dto';
import { UserDocument } from 'src/user/user.schema';
import { TrainerService } from 'src/trainer/trainer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly trainerService: TrainerService,
  ) {}

  async signUp(dto: CreateUserDto) {
    if (dto.role === 'trainer') {
      return this.trainerService.checkUser(dto);
    } else {
      return this.userService.checkUser(dto);
    }
  }

  async trainerSignUp(dto: CreateUserDto) {
    return this.userService.checkUser(dto);
  }

  async login(loginData: LoginDto, res: Response) {
    const user = await this.validateLogin(loginData);
    const tokens = await this.generateTokens(user as User);
    this.storeTokens(res, tokens, user.id);
    return user;
  }

  private async validateLogin(loginData: LoginDto) {
    const user = await this.userService.findUserLogin(loginData.email);
    if (user) {
      await this.validatePassword(user, loginData.password);
      return user;
    }

    const trainer = await this.trainerService.findTrainerLogin(loginData.email);

    if (trainer) {
      await this.validatePassword(trainer, loginData.password);
      return trainer;
    }

    throw new UnauthorizedException('User not found');
  }

  // private async validateTrainer(loginData: LoginDto) {
  //   const trainer = await this.trainerService.findTrainerLogin(loginData.email);
  //   if (!trainer) throw new UnauthorizedException('Trainer not found');

  //   const isMatch = await bcrypt.compare(loginData.password, trainer.password);
  //   if (!isMatch) throw new UnauthorizedException('Incorrect credentials');

  //   return trainer;
  // }
private async validatePassword(entity: any, password: string) {
  const isMatch = await bcrypt.compare(password, entity.password);
  if (!isMatch) throw new UnauthorizedException('Incorrect credentials');
}

  private async generateTokens(user: User) {
    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  private async storeTokens(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
    userId: string,
  ) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    await this.userService.addRefreshToken(userId, tokens.refreshToken);
  }

  async findUserById(userId: string) {
    return await this.userService.findUserById(userId);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded: any = this.jwtService.verifyToken(refreshToken);
      const userId = decoded.sub || decoded.id;

      const user = await this.userService.findUserById(userId);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (
        user.refreshTokenExpiresAt &&
        new Date() > user.refreshTokenExpiresAt
      ) {
        throw new UnauthorizedException('Refresh token expired');
      }

      const payload = { id: user._id, email: user.email, role: user.role };

      const newAccessToken = this.jwtService.signAccessToken(payload);
      const newRefreshToken = this.jwtService.signRefreshToken(payload);
      this.userService.addRefreshToken(userId, newRefreshToken);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Could not refresh token');
    }
  }

  setAccessTokenCookie(res: Response, accessToken: string): void {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
  async validateAdmin(body: adminLoginDto, res: Response): Promise<boolean> {
    const { email, password } = body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      throw new UnauthorizedException('Enter valid email and password');
    }

    const payload = { role: 'admin' };

    const newAccessToken = this.jwtService.signAccessToken(payload);
    const newRefreshToken = this.jwtService.signRefreshToken(payload);

    this.setAccessTokenAndRefreshTokenCookie(
      res,
      newAccessToken,
      newRefreshToken,
    );

    return true;
  }

  setAccessTokenAndRefreshTokenCookie(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie('admin_access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.cookie('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}

// @Post('login')
// async login(@Body() body: LoginDto, @Res() res: Response) {
//   const user = await this.authService.login(body, res);
//   return res.json({
//     message: 'Login successful',
//     user: {
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//     loggedIn: true,
//   });
// }
