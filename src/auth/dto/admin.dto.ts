import { IsEmail, IsString } from 'class-validator';

export class LoginAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
