import { IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export enum Role {
  Trainer = 'trainer',
  User = 'user',
}

export class  CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsIn([Role.Trainer, Role.User])
  role: Role;
}
