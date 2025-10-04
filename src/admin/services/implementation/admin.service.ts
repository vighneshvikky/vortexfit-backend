import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
import {
  IPasswordUtil,
  PASSWORD_UTIL,
} from 'src/common/interface/IPasswordUtil.interface';
import { VideoGateway } from 'src/common/video/video.gateway';

@Injectable()
export class AdminService implements IAdminService {
  private readonly adminEmail = process.env.ADMIN_EMAIL!;
  private readonly adminPassword = process.env.ADMIN_PASSWORD!;
  private url = `${process.env.FRONTEND_URL}/auth/login?role=trainer`;

  constructor(
    @Inject(IJwtTokenService) private readonly _jwtService: IJwtTokenService,
    @Inject('REDIS_CLIENT') private readonly _redis: Redis,
    @Inject(IUserRepository) private readonly _userRepository: IUserRepository,
    @Inject(MAIL_SERVICE) private readonly _mailService: IMailService,
    @Inject(ITrainerRepository)
    private readonly _trainerRepository: ITrainerRepository,
    @Inject(PASSWORD_UTIL) private readonly _passwordUtil: IPasswordUtil,
    private readonly videoGateway: VideoGateway,
  ) {}

  async verifyAdminLogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (email !== this.adminEmail) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    if (
      !(await this._passwordUtil.comparePassword(password, this.adminPassword))
    ) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const accessToken = this._jwtService.signAccessToken({
      sub: process.env.ADMIN_ID!,
      role: 'admin',
      isBlocked: false,
    });

    const refreshToken = this._jwtService.signRefreshToken({
      sub: 'admin',
      role: 'admin',
      isBlocked: false,
    });

    const refreshTokenTTL = parseInt(process.env.REFRESH_TOKEN_TTL!, 10);

    if (isNaN(refreshTokenTTL)) {
      throw new Error('REFRESH_TOKEN_TTL must be a valid integer');
    }

    await this._redis.set(refreshToken, 'admin', 'EX', refreshTokenTTL);

    await this._redis.set(refreshToken, 'admin', 'EX', refreshTokenTTL);

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
      users = await this._userRepository.findUsersBySearch(search);
    }

    if (filter === UserFilter.ALL || filter === UserFilter.TRAINER) {
      trainers = await this._trainerRepository.findTrainersBySearch(search);
    }

    if (filter === UserFilter.ALL || filter === UserFilter.BLOCKED) {
      users = await this._userRepository.find({ isBlocked: true });
      trainers = await this._trainerRepository.find({ isBlocked: true });
    }

    const combined = [...users, ...trainers].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = combined.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginated = combined.slice(startIndex, startIndex + limit);

    const mapped = paginated.map((entity) =>
      AdminUserMapper.toAdminUserDto(entity),
    );

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
      const user = await this._userRepository.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await this._userRepository.updateById(id, {
        isBlocked: !user.isBlocked,
      });

      // this.videoGateway.removeBlockedUser(id);

      return AdminUserMapper.toAdminUserDto(updatedUser);
    } else if (role === 'trainer') {
      const trainer = await this._trainerRepository.findById(id);
      if (!trainer) {
        throw new NotFoundException('Trainer not found');
      }
      const updatedTrainer = await this._trainerRepository.updateById(id, {
        isBlocked: !trainer.isBlocked,
      });
      // this.videoGateway.removeBlockedUser(id);
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
    const result = await this._trainerRepository.findPaginated(query, {
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
    const trainer = await this._trainerRepository.updateById(trainerId, {
      isVerified: true,
      verificationStatus: VerificationStatus.Approved,
      verifiedAt: new Date(),
    });

    await this._mailService.sendMail(trainer.email, 'accept', this.url);

    return AdminUserMapper.toAdminUserDto(trainer);
  }

  async rejectTrainer(
    trainerId: string,
    reason: string,
  ): Promise<AdminUserDto> {
    const trainer = await this._trainerRepository.updateById(trainerId, {
      isVerified: false,
      verificationStatus: VerificationStatus.Rejected,
      rejectionReason: reason,
      rejectedAt: new Date(),
    });

    await this._mailService.sendMail(trainer.email, 'reject', this.url);
    return AdminUserMapper.toAdminUserDto(trainer);
  }
}
