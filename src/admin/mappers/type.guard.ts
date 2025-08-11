import { User } from 'src/user/schemas/user.schema';
import { Trainer } from 'src/trainer/schemas/trainer.schema';

export function isTrainer(entity: User | Trainer): entity is Trainer {
  return 'verificationStatus' in entity;
}

export function isUser(entity: User | Trainer): entity is User {
  return 'dob' in entity || 'fitnessGoals' in entity;
}
