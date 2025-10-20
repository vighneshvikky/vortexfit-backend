import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository
  extends BaseRepository<UserDocument>
  implements IUserRepository
{
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.model.findById(id).exec();
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async findUsersBySearch(
    search: string,
    page: number,
    limit: number,
  ): Promise<UserDocument[]> {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    return this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countUsersBySearch(search: string) {
    const query = search ? { fullName: { $regex: search, $options: 'i' } } : {};
    return this.model.countDocuments(query).exec();
  }

  async findBlockedUsers(search: string): Promise<User[]> {
    const query: FilterQuery<User> = { isBlocked: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    return this.find(query);
  }

  async countBlockedUsers(search: string): Promise<number> {
    const query: FilterQuery<User> = { isBlocked: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    return this.model.countDocuments(query).exec();
  }
}
