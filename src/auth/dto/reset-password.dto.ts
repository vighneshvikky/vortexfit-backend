import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  role: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
