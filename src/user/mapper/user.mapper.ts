import {  User, UserDocument } from '../schemas/user.schema';
import { UserModel } from '../model/user.model';
import { UserProfileDto } from '../dtos/user.mapper.dto';

export class UserMapper {
  static toDomain(userDoc: UserDocument | User): UserModel | null{
    if (!userDoc) return null;

    return new UserModel({
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      role: userDoc.role,
      provider: userDoc.provider,
      isBlocked: userDoc.isBlocked,
      isVerified: userDoc.isVerified,
      googleId: userDoc.googleId,
      image: userDoc.image,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
      dob: userDoc.dob,
      height: userDoc.height,
      heightUnit: userDoc.heightUnit,
      weight: userDoc.weight,
      weightUnit: userDoc.weightUnit,
      fitnessLevel: userDoc.fitnessLevel,
      fitnessGoals: userDoc.fitnessGoals,
      trainingTypes: userDoc.trainingTypes,
      preferredTime: userDoc.preferredTime,
      equipments: userDoc.equipments,
    });
  }

  static toDto(user: UserModel | null): UserProfileDto | null{
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      image: user.image,
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
    };
  }
}
