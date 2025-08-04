import { AdminUserDto } from '../dtos/admin-user.dto';
import { User } from 'src/user/schemas/user.schema';
import { Trainer } from 'src/trainer/schemas/trainer.schema';
import { isUser, isTrainer } from './type.guard';

export class AdminUserMapper {
  static toAdminUserDto(entity: User | Trainer): AdminUserDto {
    const baseDto: AdminUserDto = {
      _id: entity._id.toString(),
      name: entity.name,
      email: entity.email,
      role: isTrainer(entity) ? 'trainer' : 'user',
      isBlocked: entity.isBlocked,
      createdAt: entity.createdAt,
      image: entity.image,
      isVerified: entity.isVerified,
    };

    if (isTrainer(entity)) {
      return {
        ...baseDto,
        phoneNumber: entity.phoneNumber,
        verifiedAt: entity.verifiedAt,
        verificationStatus: entity.verificationStatus,
        rejectionReason: entity.rejectionReason,
        rejectedAt: entity.rejectedAt,
        category: entity.category,
        specialization: entity.specialization,
        experience: entity.experience,
        bio: entity.bio,
        certificationUrl: entity.certificationUrl,
        idProofUrl: entity.idProofUrl,
        pricing: entity.pricing,
      };
    }

    if (isUser(entity)) {
      return {
        ...baseDto,
        dob: entity.dob,
        height: entity.height,
        heightUnit: entity.heightUnit,
        weight: entity.weight,
        weightUnit: entity.weightUnit,
        fitnessLevel: entity.fitnessLevel,
        fitnessGoals: entity.fitnessGoals,
        trainingTypes: entity.trainingTypes,
        preferredTime: entity.preferredTime,
        equipments: entity.equipments,
      };
    }

    return baseDto;
  }
}
