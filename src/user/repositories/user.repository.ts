import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async findUsersBySearch(search?: string): Promise<UserDocument[]> {
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    return this.model.find(query).exec();
  }
}
