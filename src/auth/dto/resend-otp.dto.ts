import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: 'user' | 'trainer';
}
