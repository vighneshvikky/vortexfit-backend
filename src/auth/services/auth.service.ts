import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from 'src/user/services/user.service';
import { LoginDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from './jwt.service';
import { User } from '../interface/user-interface';
import { Response } from 'express';



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
     this.storeTokens(res, tokens, user.id)
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
  const payload = {id: user._id, email: user.email, role: user.role};
  const accessToken = this.jwtService.signAccessToken(payload);
  const refreshToken = this.jwtService.signRefreshToken(payload);

  return {accessToken, refreshToken}
  }

  private async storeTokens(res: Response, tokens: {accessToken: string, refreshToken: string}, userId: string){
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

  await this.userService.addRefreshToken(userId, tokens.refreshToken)
  }

  //async validateRefreshToken(token: string): Promise<User> {
    // const user = await this.userModel.findOne({ refreshToken: token });
  
    // if (!user || user.refreshTokenExpiresAt < new Date()) {
    //   throw new UnauthorizedException('Refresh token expired or invalid');
    // }
  
    // return user;
 // }
  
}
