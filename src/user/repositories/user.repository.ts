import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    console.log('email', email);
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(userData: CreateUserDto): Promise<UserDocument> {
    console.log('userData', userData);
    const createdUser = await this.userModel.create(userData);
    console.log('createdUser', createdUser);
    return createdUser;
  }

  async addRefreshToken(userId: string, token: string): Promise<void> {
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: token,
      refreshTokenExpiresAt: expiry,
    });
  }

  async findUserById(userId: string) {
    return await this.userModel.findById(userId);
  }

  async findAllUsers() {
    return await this.userModel.find();
  }

  async findByIdAndUpdate(userId: string, isBlocked: boolean) {
    return this.userModel
      .findByIdAndUpdate(userId, { isBlocked }, { new: true })
      .exec();
  }
}
