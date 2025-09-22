import { Trainer } from '../schemas/trainer.schema';
import { TrainerModel } from '../models/trainer.model';
import { TrainerProfileDto } from '../dtos/trainer.dto';

export class TrainerMapper {
  static toDomain(trainerDoc: Trainer): TrainerModel | null {
    if (!trainerDoc) return null;

    const trainer = new TrainerModel(
      trainerDoc.verificationStatus,
      trainerDoc.phoneNumber,
      trainerDoc.category,
      trainerDoc.specialization,
      trainerDoc.experience,
      trainerDoc.bio,
      trainerDoc.certificationUrl,
      trainerDoc.idProofUrl,
      trainerDoc.rejectionReason,
      trainerDoc.rejectedAt,
      trainerDoc.pricing,
    );

    trainer._id = trainerDoc._id;
    trainer.name = trainerDoc.name;
    trainer.email = trainerDoc.email;
    trainer.password = trainerDoc.password;
    trainer.role = 'trainer';
    trainer.provider = trainerDoc.provider;
    trainer.isBlocked = trainerDoc.isBlocked;
    trainer.isVerified = trainerDoc.isVerified;
    trainer.image = trainerDoc.image;
    trainer.createdAt = trainerDoc.createdAt;
    trainer.updatedAt = trainerDoc.updatedAt;

    return trainer;
  }

  static toProfileDto(domain: TrainerModel | null): TrainerProfileDto | null {
    if (!domain) return null;
    return {
      _id: domain._id.toString(),
      name: domain.name,
      email: domain.email,
      phoneNumber: domain.phoneNumber,
      specialization: domain.specialization,
      experience: domain.experience,
      bio: domain.bio,
      certificationUrl: domain.certificationUrl,
      idProofUrl: domain.idProofUrl,
      pricing: domain.pricing,
      isBlocked: domain.isBlocked,
    };
  }
}
