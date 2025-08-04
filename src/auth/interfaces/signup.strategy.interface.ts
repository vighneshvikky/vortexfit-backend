import { SignupDto } from '../dto/auth.dto';
import { CreateAccountDto } from '../dto/createAccount.dto';
import { SignUpResponseDto } from '../dto/signup-response.dto';

export interface ISignUpStrategy {
  signUp(data: SignupDto | CreateAccountDto): Promise<SignUpResponseDto>;
}
