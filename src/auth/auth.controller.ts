import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { setTokenCookies } from 'src/common/helpers/token.setter';
import { IJwtTokenService } from './interfaces/ijwt-token-service.interface';
import { SignupDto } from './dto/auth.dto';
import { IOtpService, OTP_SERVICE } from './interfaces/otp-service.interface';
import {
  AUTH_SERVICE,
  IAuthService,
} from './interfaces/auth-service.interface';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { TokenPayload } from './interfaces/token-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(OTP_SERVICE) private readonly otpService: IOtpService,
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
    @Inject(IJwtTokenService) private readonly jwtService: IJwtTokenService,
  ) {}
  @Post('signup')
  async signUp(@Body() body: SignupDto) {
    return this.authService.signUp(body);
  }
  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return await this.otpService.verifyOtp(body);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: ResendOtpDto) {
    return await this.otpService.resendOtp(body);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.verifyLogin(body);

    setTokenCookies(res, accessToken, refreshToken);
    return {
      message: 'Login successfully',
      data: {
        user,
      },
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email, role }: ForgotPasswordDto) {
    return this.authService.initiatePasswordReset(email, role);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const data = await this.authService.resetPassword(
      dto.token,
      dto.role,
      dto.newPassword,
    );

    return data;
  }

  @Post('refresh/token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
   console.log('refresh tokenn', refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const payload = this.jwtService.decodeToken(refreshToken);

    if (!payload?.sub || !payload?.role) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    const { accessToken, newRefreshToken } =
      await this.authService.rotateRefreshToken(refreshToken, payload.role);

    setTokenCookies(res, accessToken, newRefreshToken);

    return res.send({
      message: 'Tokens refreshed',
      role: payload.role,
    });
  }

  @Get('google/redirect')
  redirectGoogle(@Query('role') role: string, @Res() res: Response) {
    const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    redirectUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
    redirectUrl.searchParams.set(
      'redirect_uri',
      process.env.GOOGLE_REDIRECT_URI!,
    );
    redirectUrl.searchParams.set('response_type', 'code');
    redirectUrl.searchParams.set('scope', 'openid email profile');
    redirectUrl.searchParams.set('state', role);

    return res.redirect(redirectUrl.toString());
  }

  @Get('google/callback')
  async handleGoogleCallback(
    @Query('code') code: string,
    @Query('state') role: string,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.googleLogin(code, role);

    setTokenCookies(res, accessToken, refreshToken);

    const redirectUrl = new URL('http://localhost:4200/auth/callback');
    redirectUrl.searchParams.set('email', user.email);
    redirectUrl.searchParams.set('name', user.name);
    redirectUrl.searchParams.set('role', user.role);
    redirectUrl.searchParams.set('isVerified', String(user.isVerified));

    return res.redirect(
      `http://localhost:4200/auth/callback?user=${encodeURIComponent(JSON.stringify(user))}`,
    );
  }

  @Post('logout')
    @UseGuards(JwtAuthGuard, RolesGuard)
  async logOut(
     @GetUser() user: TokenPayload,
    @Res() res: Response,
  ): Promise<void> {

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res
      .status(200)
      .json({ message: 'Logged out successfully', role: user.role });
  }
}
