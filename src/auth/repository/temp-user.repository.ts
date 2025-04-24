import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TempUser } from '../schema/temp-user.schema';

@Injectable()
export class TempUserRepository {
  constructor(
    @InjectModel(TempUser.name)
    private readonly tempUserModel: Model<TempUser>,
  ) {}

  async create(tempUserData: Partial<TempUser>): Promise<TempUser> {
    return await this.tempUserModel.create(tempUserData);
  }

  async findByEmail(email: string): Promise<TempUser | null> {
    return this.tempUserModel
      .findOne({ email }, { email: 1, name: 1, password: 1, role: 1, _id: 0 })
      .lean()
      .exec();
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.tempUserModel.deleteOne({ email }).exec();
  }
}
