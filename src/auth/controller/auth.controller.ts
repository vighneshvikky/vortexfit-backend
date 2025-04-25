import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Res,
  HttpCode,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, Role } from '../dto/create-user.dto';
import { OtpService } from '../services/otp.service';
import { UserService } from 'src/user/services/user.service';
import { LoginDto } from '../dto/auth.dto';
import { Response, Request } from 'express';
import { JwtService } from '../services/jwt.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OtpService,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const isValid = await this.otpService.verifyOtp(body.email, body.otp);
    console.log('isValid', isValid);
    if (!isValid) {
      return 'Enter a valid otp.';
    }

    const tempUserStr = await this.userService.findTempUser(body.email);
    console.log('tempUserStr', tempUserStr);
    if (!tempUserStr) {
      throw new NotFoundException('User data expired or not found');
    }

    const user = await this.userService.createUser({
      ...tempUserStr,
      role: tempUserStr.role === 'trainer' ? Role.Trainer : Role.User,
    });
    
    // console.log('user', user);
    return user;
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: { email: string }) {
    console.log('resend email', body.email);
    const tempUserStr = await this.userService.findTempUser(body.email);
    console.log('tempUserStr', tempUserStr);
    if (!tempUserStr) {
      throw new NotFoundException('User data expired. Please register again.');
    }
    const newOtp = this.otpService.generateAndStoreOtp(body.email);

    return newOtp;
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const user  = await this.authService.login(body, res);
    return res.json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      loggedIn: true,
    });
  }

  @Post('validateRefreshToken')
  async validateRefreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const accessToken = req.cookies['access_token'];

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    const decoded = this.jwtService.decodeToken(accessToken);
    if (!decoded || typeof decoded === 'string' || !decoded['id']) {
      throw new UnauthorizedException('Invalid access token');
    }

    const userId = decoded['id'];

    const user = await this.userService.findUserById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('User not found or refresh token missing');
    }

    const newAccessToken = await this.authService.refreshToken(user.refreshToken);


    return { 
      success: true,
      message: 'Access token refreshed successfully' 
    };
    

  }
  
  
  

  
}
