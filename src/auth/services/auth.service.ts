import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from 'src/user/services/user.service';
import { LoginDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from './jwt.service';
import { User } from '../interface/user-interface';
import { Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: CreateUserDto) {
    return this.userService.checkUser(dto);
  }

  async login(loginData: LoginDto, res: Response) {
    const user = await this.validateUser(loginData);
    const tokens = await this.generateTokens(user as User);
    this.storeTokens(res, tokens, user.id);
    return user;
  }

  private async validateUser(loginData: LoginDto) {
    const user = await this.userService.findUserLogin(loginData.email);
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect credentials');

    return user;
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
}
