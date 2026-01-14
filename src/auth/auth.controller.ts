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
    @Inject(OTP_SERVICE) private readonly _otpService: IOtpService,
    @Inject(AUTH_SERVICE) private readonly _authService: IAuthService,
    @Inject(IJwtTokenService) private readonly _jwtService: IJwtTokenService,
  ) {}
  @Post('signup')
  async signUp(@Body() body: SignupDto) {
    return this._authService.signUp(body);
  }
  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return await this._otpService.verifyOtp(body);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: ResendOtpDto) {
    return await this._otpService.resendOtp(body);
  }



  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    console.log('body', body);
    const result = await this._authService.verifyLogin(body);

    return {
      message: result.message,
      data: result,
    };
  }

  @Post('mfa/setup')
  async setupMfa(@Body('userId') userId: string, @Body('role') role: string) {
    console.log('userId', userId);
    console.log('role for setup', role);
    const data = await this._authService.setupMfa(userId, role);

    console.log('data for set mfa', data);

    return { data };
  }

  @Post('mfa/verify-login')
  async verifyMfaLogin(
    @Body('userId') userId: string,
    @Body('otp') otp: string,
    @Body('role') role: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._authService.verifyMfaLogin(userId, otp, role);

    setTokenCookies(res, result.accessToken, result.refreshToken);
    return {
      message: 'Login successfully',
      data: {
        user: result.user,
      },
    };
  }

  @Post('mfa/verify-setup')
  async verifyMfaSetup(
    @Body('userId') userId: string,
    @Body('otp') otp: string,
    @Body('role') role: string,
  ) {
    const result = await this._authService.verifyMfaSetup(userId, otp, role);

    return {
      message: result.message,

    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email, role }: ForgotPasswordDto) {
    return this._authService.initiatePasswordReset(email, role);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const data = await this._authService.resetPassword(
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

    const payload = this._jwtService.decodeToken(refreshToken);

    if (!payload?.sub || !payload?.role) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    const { accessToken, newRefreshToken } =
      await this._authService.rotateRefreshToken(
        refreshToken,
        payload.role,
        payload.sub,
      );

    setTokenCookies(res, accessToken, newRefreshToken);

    return res.send({
      message: 'Tokens refreshed',
      role: payload.role,
    });
  }



  @Get('google/redirect')
  async googleRedirect(@Query('role') role: string, @Res() res: Response) {
    const state = Buffer.from(JSON.stringify({ role })).toString('base64');

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
      {
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: 'code',
        scope: 'email profile',
        state, 
      },
    )}`;

    res.redirect(googleAuthUrl);
  }



  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
    
      const { role } = JSON.parse(Buffer.from(state, 'base64').toString());

      const result = await this._authService.googleLogin(code, role);

     
      if (result.mfaRequired) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/mfa-verify?userId=${result.userId}&role=${role}&provider=google`,
        );
      }

      if (result.mfaSetupRequired) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/mfa-setup?userId=${result.userId}&role=${role}&provider=google`,
        );
      }

   
      res.redirect(`${process.env.FRONTEND_URL}/auth/login?role=${role}`);
    } catch (error) {
      console.error('Google callback error:', error);
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  logOut(@GetUser() user: TokenPayload, @Res() res: Response) {
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
