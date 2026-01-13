import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class AuthUserModel {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: string;

  mfaEnabled: boolean;
  mfaSecret?: string;
  mfaTempSecret?: string;
  recoveryCodes?: string[];
}


export abstract class BaseModel {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ required: true, enum: ['user', 'trainer', 'admin'] })
  role: 'user' | 'trainer' | 'admin';

  @Prop({ default: 'local', enum: ['local', 'google'] })
  provider: 'local' | 'google';

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  googleId?: string;

  @Prop()
  image: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  /* ================= MFA FIELDS ================= */

 @Prop({ type: Boolean, default: false })
mfaEnabled: boolean;

@Prop({ type: String, default: null })
mfaSecret?: string;

@Prop({ type: String, default: null })
mfaTempSecret?: string | null;

@Prop({ type: [String], default: [] })
recoveryCodes: string[];
}
