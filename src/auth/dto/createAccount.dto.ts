import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;

  @IsIn(['user', 'trainer'])
  readonly role: 'user' | 'trainer';
}
