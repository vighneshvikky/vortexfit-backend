import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Res,
  HttpCode,
  Req,
  UnauthorizedException,
  Get,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, Role } from '../dto/create-user.dto';
import { OtpService } from '../services/otp.service';
import { UserService } from 'src/user/services/user.service';
import { LoginDto } from '../dto/auth.dto';
import { Response, Request } from 'express';
import { JwtService } from '../services/jwt.service';
import { adminLoginDto } from '../dto/adminLogin.dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { TrainerService } from 'src/trainer/trainer.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OtpService,
    private userService: UserService,
    private jwtService: JwtService,
    private trainerService: TrainerService,
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

    if (!tempUserStr) {
      throw new NotFoundException('User data expired or not found');
    }

    if (tempUserStr.role === 'trainer') {
      return await this.trainerService.createTrainer({
        ...tempUserStr,
        role: Role.Trainer,
      });
    } else {
      const user = await this.userService.createUser({
        ...tempUserStr,
        role: Role.User,
      });

      return {
        message: 'User created successfully',
        user,
      };
    }
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: { email: string }) {
    const otp = await this.otpService.generateAndStoreOtp(body.email);

    return {
      message: 'OTP sent to email',
      email: body.email,
      otp,
    };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto, @Res() res: Response) {
    console.log('Login request received for:', body.email);
    const user = await this.authService.login(body, res);
    console.log('Login successful, user:', user);

    return res.json({
      message: 'Login successful',
      user,
      loggedIn: true,
    });
  }

  @Post('validateRefreshToken')
  async validateRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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
      throw new UnauthorizedException(
        'User not found or refresh token missing',
      );
    }

    const newAccessToken = await this.authService.refreshToken(
      user.refreshToken,
    );

    return {
      success: true,
      message: 'Access token refreshed successfully',
    };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('Refresh token request received');
    console.log('Cookies:', req.cookies);

    // Get the refresh token from the cookie
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      console.log('No refresh token found in cookies');
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      // Use the auth service to refresh the token
      const { accessToken } = await this.authService.refreshToken(refreshToken);
      console.log('New access token generated');

      // Set the new access token in an HTTP-only cookie
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      return {
        success: true,
        message: 'Access token refreshed successfully',
      };
    } catch (error) {
      console.log('Error refreshing token:', error);
      throw new UnauthorizedException('Failed to refresh token');
    }
  }

  @Post('adminLogin')
  async adminLogin(@Body() body: adminLoginDto, @Res() res: Response) {
    const isValid = await this.authService.validateAdmin(body, res);

    return res.json({
      message: 'Login successful',
      isValid,
    });
  }

  @Get('users')
  async getUsers() {
    try {
      const [users, trainers] = await Promise.all([
        this.userService.findAllUsers(),
        this.trainerService.findAllTrainers()
      ]);

      return {
        users: users || [],
        trainers: trainers || []
      };
    } catch (error) {
      console.error('Error fetching users and trainers:', error);
      throw new HttpException('Failed to fetch users and trainers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('users/:role/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Param('role') role: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    if (role === 'user') {
      return this.userService.updateUserStatus(
        id,
        updateUserStatusDto.isBlocked,
      );
    } else if (role === 'trainer') {
      return this.trainerService.updateTrainerStatus(
        id,
        updateUserStatusDto.isBlocked,
      );
    } else {
      throw new NotFoundException('Invalid role');
    }
  }
}
