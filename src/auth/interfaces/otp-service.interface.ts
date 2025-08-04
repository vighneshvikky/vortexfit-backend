import { ResendOtpDto } from 'src/auth/dto/resend-otp.dto';
import { VerifyOtpDto } from 'src/auth/dto/verify-otp.dto';
import { ApiResponse } from 'src/auth/interfaces/api.response.interface';

export interface IOtpService {
  generateOtp(email: string): Promise<string>;

  verifyOtp(data: VerifyOtpDto): Promise<{
    message: string;
    data: { message: string; isBlocked: boolean; role: string };
  }>;

  resendOtp(
    data: ResendOtpDto,
  ): Promise<ApiResponse<{ email: string; role: string }>>;
}

export const OTP_SERVICE = Symbol('OtpService');
