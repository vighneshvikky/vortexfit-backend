import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PasswordUtil } from 'src/common/helpers/password.util';
import Redis from 'ioredis';
import { Inject } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { PaginatedResult } from 'src/common/interface/base-repository.interface';
import { IUserRepository } from 'src/user/interfaces/user-repository.interface';
import { ITrainerRepository } from 'src/trainer/interfaces/trainer-repository.interface';
import { IJwtTokenService } from 'src/auth/interfaces/ijwt-token-service.interface';
import {
  GetUsersOptions,
  IAdminService,
} from '../interface/admin-service.interface';
import {
  IMailService,
  MAIL_SERVICE,
} from 'src/common/helpers/mailer/mail-service.interface';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { AdminUserMapper } from '../../mappers/admin-user.mapper';
import { AdminUserDto } from '../../dtos/admin-user.dto';
import { UserFilter } from 'src/admin/enums/admin.enums';

@Injectable()
export class AdminService implements IAdminService {
  private readonly adminEmail = process.env.ADMIN_EMAIL!;
  private readonly adminPassword = process.env.ADMIN_PASSWORD!;
  private url = `${process.env.FRONTEND_URL}/auth/login?role=trainer`;

  constructor(
    @Inject(IJwtTokenService) private readonly jwtService: IJwtTokenService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(MAIL_SERVICE) private readonly mailService: IMailService,
    @Inject(ITrainerRepository)
    private readonly trainerRepository: ITrainerRepository,
  ) {}

  async verifyAdminLogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (email !== this.adminEmail) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    if (!(await PasswordUtil.comparePassword(password, this.adminPassword))) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const accessToken = this.jwtService.signAccessToken({
      sub: 'admin',
      role: 'admin',
      isBlocked: false,
    });

    const refreshToken = this.jwtService.signRefreshToken({
      sub: 'admin',
      role: 'admin',
      isBlocked: false,
    });

    const refreshTokenTTL = 7 * 24 * 60 * 60 * 1000;
    await this.redis.set(refreshToken, 'admin', 'EX', refreshTokenTTL);

    return { accessToken, refreshToken };
  }

  async getUsers({
    search,
    page = 1,
    limit = 10,
    filter,
  }: GetUsersOptions): Promise<PaginatedResult<AdminUserDto>> {
    page = Number(page);
    limit = Number(limit);

    if (!limit || limit <= 0) {
      throw new BadRequestException('Limit must be greater than 0');
    }

    let users: User[] = [];
    let trainers: Trainer[] = [];

    if (filter === UserFilter.ALL || filter === UserFilter.USER) {
      users = await this.userRepository.findUsersBySearch(search);
    }

    if (filter === UserFilter.ALL || filter === UserFilter.TRAINER) {
      trainers = await this.trainerRepository.findTrainersBySearch(search);
    }

    if(filter === UserFilter.ALL || filter === UserFilter.BLOCKED){
      users = await this.userRepository.find({isBlocked: true})
      trainers = await this.trainerRepository.find({isBlocked: true})
    }

    const combined = [...users, ...trainers].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = combined.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginated = combined.slice(startIndex, startIndex + limit);

    const mapped = paginated.map(AdminUserMapper.toAdminUserDto);

    return {
      data: mapped,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async toggleBlockStatus(
    id: string,
    role: 'user' | 'trainer',
  ): Promise<AdminUserDto> {
    if (role === 'user') {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await this.userRepository.updateById(id, {
        isBlocked: !user.isBlocked,
      });
      //  return updatedUser;

      return AdminUserMapper.toAdminUserDto(updatedUser);
    } else if (role === 'trainer') {
      const trainer = await this.trainerRepository.findById(id);
      if (!trainer) {
        throw new NotFoundException('Trainer not found');
      }
      const updatedTrainer = await this.trainerRepository.updateById(id, {
        isBlocked: !trainer.isBlocked,
      });

      return AdminUserMapper.toAdminUserDto(updatedTrainer);
    }
    throw new NotFoundException('Invalid role specified');
  }

  async getUnverifiedTrainers({
    page = 1,
    limit = 10,
  }: GetUsersOptions): Promise<PaginatedResult<AdminUserDto>> {
    const query = {
      isVerified: false,
      verificationStatus: VerificationStatus.Pending,
    };
    const result = await this.trainerRepository.findPaginated(query, {
      page,
      limit,
    });

    const mappedData = result.data.map((trainer) =>
      AdminUserMapper.toAdminUserDto(trainer),
    );

    return {
      ...result,
      data: mappedData,
    };
  }

  async approveTrainer(trainerId: string): Promise<AdminUserDto> {
    const trainer = await this.trainerRepository.updateById(trainerId, {
      isVerified: true,
      verificationStatus: VerificationStatus.Approved,
      verifiedAt: new Date(),
    });

    await this.mailService.sendMail(trainer.email, 'accept', this.url);

    return AdminUserMapper.toAdminUserDto(trainer);
  }

  async rejectTrainer(
    trainerId: string,
    reason: string,
  ): Promise<AdminUserDto> {
    const trainer = await this.trainerRepository.updateById(trainerId, {
      isVerified: false,
      verificationStatus: VerificationStatus.Rejected,
      rejectionReason: reason,
      rejectedAt: new Date(),
    });

    await this.mailService.sendMail(trainer.email, 'reject', this.url);
    return AdminUserMapper.toAdminUserDto(trainer);
  }
}
