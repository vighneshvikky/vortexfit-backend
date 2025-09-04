import { Inject, Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { UserProfileDto } from '../dtos/user.mapper.dto';
import { ITrainerRepository } from 'src/trainer/interfaces/trainer-repository.interface';
import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { FindApprovedTrainerQuery } from '../interfaces/user-interface';
import { IUserService } from '../interfaces/user-service.interface';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepo: IUserRepository,
    @Inject(ITrainerRepository)
    private readonly trainerRepo: ITrainerRepository,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findByEmail(email);
  }


  async findById(id: string): Promise<UserProfileDto | null> {
    const userData = await this.userRepo.findById(id);

    const userDomain = UserMapper.toDomain(userData);
    return UserMapper.toDto(userDomain);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.userRepo.updatePassword(userId, newPassword);
  }



  async findByIdAndUpdate(
    userId: string,
    data: Partial<UserProfileDto>,
  ): Promise<UserProfileDto | null> {
    const user = await this.userRepo.updateById(userId, {
      ...data,
      isVerified: true,
      image: data.image,
    });

    const userDomain = UserMapper.toDomain(user);

    return UserMapper.toDto(userDomain);
  }

  async findTrainer(id: string): Promise<Trainer | null> {
    return await this.trainerRepo.findById(id);
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

    return await this.trainerRepo.findAll(query);
  }
}
