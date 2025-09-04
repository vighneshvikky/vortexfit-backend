import { User, UserDocument } from '../schemas/user.schema';
import { UserModel } from '../model/user.model';
import { UserProfileDto } from '../dtos/user.mapper.dto';

export class UserMapper {
  static toDomain(userDoc: UserDocument | User): UserModel | null {
    if (!userDoc) return null;

    return new UserModel(
      userDoc._id.toString(),
      userDoc.name,
      userDoc.dob,
      userDoc.height,
      userDoc.heightUnit,
      userDoc.weight,
      userDoc.weightUnit,
      userDoc.fitnessLevel,
      userDoc.fitnessGoals,
      userDoc.trainingTypes,
      userDoc.preferredTime,
      userDoc.equipments,
    );
  }

  static toDto(user: UserModel | null): UserProfileDto | null {
    if (!user) return null;

    return {
      id: user.id,
      name: user['name'], 
      email: user['email'],
      isVerified: user['isVerified'],
      image: user['image'],
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
