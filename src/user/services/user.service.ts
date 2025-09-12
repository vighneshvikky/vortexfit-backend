import { Inject, Injectable } from '@nestjs/common';    
import { IUserRepository } from '../interfaces/user-repository.interface';
import { UserProfileDto } from '../dtos/user.mapper.dto';
import { ITrainerRepository } from 'src/trainer/interfaces/trainer-repository.interface';
import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { FindApprovedTrainerQuery } from '../interfaces/user-interface';
import { IUserService } from '../interfaces/user-service.interface';
import { UserMapper } from '../mapper/user.mapper';
import { UserModel } from '../model/user.model';
import { Types } from 'mongoose';
import { TrainerModel } from 'src/trainer/models/trainer.model';
import { TrainerMapper } from 'src/trainer/mapper/trainer.mapper';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private readonly _userRepo: IUserRepository,
    @Inject(ITrainerRepository)
    private readonly _trainerRepo: ITrainerRepository,
  ) {}

  async findByEmail(email: string): Promise<UserModel | null> {
    const userDoc = await this._userRepo.findByEmail(email);
    return userDoc ? UserMapper.toDomain(userDoc) : null;
  }

  async findById(id: string): Promise<UserProfileDto | null> {
    const userData = await this._userRepo.findById(id);

    const userDomain = UserMapper.toDomain(userData);
    return UserMapper.toDto(userDomain);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this._userRepo.updatePassword(userId, newPassword);
  }

  async findByIdAndUpdate(
    userId: string,
    data: Partial<UserProfileDto>,
  ): Promise<UserProfileDto | null> {
    const user = await this._userRepo.updateById(userId, {
      ...data,
      _id: data._id ? new Types.ObjectId(data._id) : undefined,
      isVerified: true,
      image: data.image,
    });

    const userDomain = UserMapper.toDomain(user);

    return UserMapper.toDto(userDomain);
  }

  async findTrainer(id: string): Promise<TrainerModel | null> {
    const trainerDoc =  await this._trainerRepo.findById(id);
  return trainerDoc? TrainerMapper.toDomain(trainerDoc):null
  }

  async findApprovedTrainer(filters: {
    category?: string;
    name?: string;
  }): Promise<Trainer[]> {
    const query: FindApprovedTrainerQuery = {
      role: 'trainer',
      verificationStatus: 'approved',
      isBlocked: false,
    };
    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    return await this._trainerRepo.findAll(query);
  }
}
