import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { HashingService } from 'src/auth/services/hashing.service';
import { OtpService } from 'src/auth/services/otp.service';
import { TempUserRepository } from 'src/auth/repository/temp-user.repository';
import { TrainerRepository } from './trainer.repository';
import { TrainerDetailsDto } from './dto/trainer-details.dto';
import { join } from 'path';

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

      async findAllTrainers(){
        return await this.trainerRepository.findAllTrainers()
      }

      async updateTrainerStatus(trainerId: string, isBlocked: boolean){
        return this.trainerRepository.findByIdAndUpdate(trainerId, isBlocked)
      }

      /**
       * Updates trainer details in the database
       * @param trainerId The ID of the trainer to update
       * @param trainerDetails The details to update
       * @returns The updated trainer document
       */
      async updateTrainerDetails(trainerId: string, trainerDetails: TrainerDetailsDto) {
        // First check if the trainer exists
        const trainer = await this.trainerRepository.findTrainerById(trainerId);
        if (!trainer) {
          throw new Error('Trainer not found');
        }
        
        // Update the trainer details
        return this.trainerRepository.updateTrainerDetails(trainerId, trainerDetails);
      }

      /**
       * Upload certification document for a trainer
       * @param trainerId The ID of the trainer
       * @param file The uploaded file
       * @returns The updated trainer document
       */
      async uploadCertification(trainerId: string, file: any) {
        // Check if trainer exists
        const trainer = await this.trainerRepository.findTrainerById(trainerId);
        if (!trainer) {
          throw new BadRequestException('Trainer not found');
        }

        // Create file path
        const filePath = join('uploads', 'certifications', file.filename);

        // Create certification object
        const certification = {
          type: 'Certification',
          document: filePath,
          verified: false
        };

        // Update trainer with new certification
        return this.trainerRepository.addCertification(trainerId, certification);
      }

      /**
       * Upload ID proof document for a trainer
       * @param trainerId The ID of the trainer
       * @param file The uploaded file
       * @returns The updated trainer document
       */
      async uploadIdProof(trainerId: string, file: any) {
        // Check if trainer exists
        const trainer = await this.trainerRepository.findTrainerById(trainerId);
        if (!trainer) {
          throw new BadRequestException('Trainer not found');
        }

        // Create file path
        const filePath = join('uploads', 'id-proofs', file.filename);

        // Update trainer with ID proof
        return this.trainerRepository.updateIdProof(trainerId, filePath);
      }
}


