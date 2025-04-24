import { Inject, Injectable } from '@nestjs/common';
import { MailService } from 'src/common/utils/mailer/mailer.service';
import { OTP_REPOSITORY } from 'src/common/constants';
import { IOtpRepository } from '../interface/otp-repository.interface';

@Injectable()
export class OtpService {
  constructor(
    @Inject(OTP_REPOSITORY) private otpRepo: IOtpRepository,
    private readonly mailService: MailService,
  ) {}
  async generateAndStoreOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
   

      await this.otpRepo.saveOtp(email, otp);

      await this.mailService.sendOtp(email, otp);
    } catch (error) {
      console.error('Error storing OTP in OtPService:', error);
    }

    return otp;
  }

  async verifyOtp(email: string, submittedOtp: string): Promise<boolean> {
    
    const storedOtp = await this.otpRepo.getOtp(email);
    console.log('submittedOtp', submittedOtp);
    console.log('storedOtp', storedOtp);
    if (storedOtp === submittedOtp) {
      return true;
    }

    return false;
  }

  async findUser(email: string) {
    return this.otpRepo.findUser(email);
  }


  async deleteOtp(email: string){
    return this.otpRepo.deleteOtp(email);
  }
}
