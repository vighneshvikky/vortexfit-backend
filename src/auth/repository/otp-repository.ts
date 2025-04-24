import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../schema/otp.schema';
import { IOtpRepository } from '../interface/otp-repository.interface';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(@InjectModel(Otp.name) private otpModel: Model<OtpDocument>) {}

  async saveOtp(email: string, otp: string): Promise<void> {
    await this.otpModel.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true },
    );
  }

  async getOtp(email: string): Promise<string | null> {
    const record = await this.otpModel.findOne({ email });
    return record?.otp ?? null;
  }

  async deleteOtp(email: string): Promise<void> {
    await this.otpModel.deleteOne({ email });
  }

  async findUser(email: string): Promise<OtpDocument | null> {
    return this.otpModel.findOne({ email });
  }
}
