import { Trainer } from '../schemas/trainer.schema';
import { TrainerProfileDto } from '../dtos/trainer.dto';

export class TrainerMapper {
  static toProfileDto(trainer: Trainer): TrainerProfileDto {
    return {
      name: trainer.name,
      email: trainer.email,
      phoneNumber: trainer.phoneNumber,
      specialization: trainer.specialization,
      experience: trainer.experience,
      bio: trainer.bio,
      category: trainer.category,
      certificationUrl: trainer.certificationUrl,
      idProofUrl: trainer.idProofUrl,
      image: trainer.image,
      isVerified: trainer.isVerified,
      verificationStatus: trainer.verificationStatus,
      rejectionReason: trainer.rejectionReason,
      pricing: trainer.pricing,
    };
  }
}
