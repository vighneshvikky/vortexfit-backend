import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { HashingService } from 'src/auth/services/hashing.service';
import { OtpService } from 'src/auth/services/otp.service';
import { MailService } from 'src/common/utils/mailer/mailer.service';
import { TempUserRepository } from 'src/auth/repository/temp-user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly otpService: OtpService,
    private readonly tempUserRepository: TempUserRepository,
  ) {}

  async checkUser(createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      return { message: 'Email already in use' };
    }

    const otp = await this.otpService.generateAndStoreOtp(createUserDto.email);

    const hashedPassword = await this.hashingService.hashPassword(
      createUserDto.password,
    );

    // const tempUser = {
    //   ...createUserDto,
    //   password: hashedPassword,
    // };

    await this.tempUserRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });

    return {
      message: 'OTP sent to email',
      email: createUserDto.email,
      otp,
    };
  }

  async createUser(userData: CreateUserDto) {
    return this.userRepository.createUser(userData);
  }

  async findUser(email: string) {
    const user = this.otpService.findUser(email);
    return user;
  }

  async findTempUser(email: string) {
    return this.tempUserRepository.findByEmail(email);
  }

  async findUserLogin(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async addRefreshToken(userId: string, refreshToken: string) {
     await this.userRepository.addRefreshToken(userId, refreshToken);
  }

  async findUserById(userId: string){
    return await this.userRepository.findUserById(userId)
  }
}
