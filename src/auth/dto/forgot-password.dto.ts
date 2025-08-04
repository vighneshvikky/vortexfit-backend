import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  role: 'user' | 'trainer';
}
