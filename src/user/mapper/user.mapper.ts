import { User } from '../schemas/user.schema';
import { UserProfileDto } from '../dtos/user.mapper.dto';
export class UserMapper {
  static toUserProfileDto(user: User ): UserProfileDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image,
      isVerified: user.isVerified,
      dob: user.dob,
      height: user.height,
      heightUnit: user.heightUnit,
      weight: user.weight,
      weightUnit: user.weightUnit,
      fitnessLevel: user.fitnessLevel,
      fitnessGoals: user.fitnessGoals,
      trainingTypes: user.trainingTypes,
      preferredTime: user.preferredTime,
      equipments: user.equipments,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isBlocked: user.isBlocked
    };
  }
}
