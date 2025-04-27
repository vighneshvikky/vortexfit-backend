import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { HashingService } from 'src/auth/services/hashing.service';
import { OtpService } from 'src/auth/services/otp.service';
import { TempUserRepository } from 'src/auth/repository/temp-user.repository';
import { TrainerRepository } from './trainer.repository';

@Injectable()
export class TrainerService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly otpService: OtpService,
    private readonly tempUserRepository: TempUserRepository,
    private readonly trainerRepository: TrainerRepository
  ) {}

  async checkUser(data) {
    console.log('createUserDto', data);
    const existingUser = await this.trainerRepository.findByEmail(
        data.email,
    );
    if (existingUser) {
      return { message: 'Email already in use' };
    }

    const otp = await this.otpService.generateAndStoreOtp(data.email);

    const hashedPassword = await this.hashingService.hashPassword(
        data.password,
    );



    await this.tempUserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    return {
      message: 'OTP sent to email',
      email: data.email,
      otp,
    };
  }

    async createTrainer(trainerData) {
      return this.trainerRepository.createTrainer(trainerData);
    }

    async findTrainer(email: string) {
        const user = this.otpService.findUser(email);
        return user;
      }
  

      async findTempUser(email: string) {
        return this.tempUserRepository.findByEmail(email);
      }

      async findTrainerLogin(email: string) {
        return await this.trainerRepository.findByEmail(email);
      }

      async addRefreshToken(trainerId: string, refreshToken: string) {
        await this.trainerRepository.addRefreshToken(trainerId, refreshToken);
     }
     async findTrainerById(trainerId: string){
        return await this.trainerRepository.findTrainerById(trainerId)
      }

      async updateTrainerStatus(trainerId: string, isBlocked: boolean){
        return this.trainerRepository.findByIdAndUpdate(trainerId, isBlocked)
      }
}


