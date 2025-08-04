import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { ResendOtpDto } from 'src/auth/dto/resend-otp.dto';
import { VerifyOtpDto } from 'src/auth/dto/verify-otp.dto';
import { ApiResponse } from 'src/auth/interfaces/api.response.interface';
import { IOtpService } from 'src/auth/interfaces/otp-service.interface';
import {
  IMailService,
  MAIL_SERVICE,
} from 'src/common/helpers/mailer/mail-service.interface';
import { MailService } from 'src/common/helpers/mailer/mailer.service';
import { ITrainerRepository } from 'src/trainer/interfaces/trainer-repository.interface';
import { IUserRepository } from 'src/user/interfaces/user-repository.interface';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject(MAIL_SERVICE) private readonly mailService: IMailService,
    @Inject(IUserRepository) private readonly userRepo: IUserRepository,
    @Inject(ITrainerRepository)
    private readonly trainerRepo: ITrainerRepository,
  ) {}

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redis.set(`otp:${email}`, otp, 'EX', 300);

    return otp;
  }

  async verifyOtp(data: VerifyOtpDto): Promise<{
    message: string;
    data: { message: string; isBlocked: boolean; role: string };
  }> {
    const storedOtp = await this.redis.get(`otp:${data.email}`);

    if (!storedOtp) {
      throw new NotFoundException('OTP expired or not found');
    }

    if (storedOtp !== data.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const userKey =
      data.role === 'trainer'
        ? `temp_trainer:${data.email}`
        : `temp_user:${data.email}`;
    const tempData = await this.redis.get(userKey);

    if (!tempData) {
      throw new NotFoundException('User data not found');
    }

    const parsedData = JSON.parse(tempData);

    if (data.role === 'user') {
      await this.userRepo.create(parsedData);
    } else if (data.role === 'trainer') {
      await this.trainerRepo.create(parsedData);
    }

    await this.redis.del(`otp:${data.email}`);
    await this.redis.del(userKey);

    return {
      message: 'Account Created Successfully',
      data: {
        message: 'Account Created Successfully',
        isBlocked: false,
        role: data.role,
      },
    };
  }

  async resendOtp(
    data: ResendOtpDto,
  ): Promise<ApiResponse<{ email: string; role: string }>> {
    const userKey =
      data.role === 'trainer'
        ? `temp_trainer:${data.email}`
        : `temp_user:${data.email}`;
    const tempData = await this.redis.get(userKey);
    if (!tempData) {
      throw new NotFoundException('User data not found ');
    }

    await this.generateOtp(data.email);


    return {
      message: 'OTP resent successfully',
      data: {
        email: data.email,
        role: data.role,
      },
    };
  }
}
