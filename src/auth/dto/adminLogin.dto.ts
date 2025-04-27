import { IsEmail, isEmail, IsNotEmpty, MinLength } from 'class-validator';

export class adminLoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
