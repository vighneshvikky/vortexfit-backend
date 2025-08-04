import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  otp: string;

  @IsNotEmpty()
  role: 'user' | 'trainer';
}
