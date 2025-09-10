import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: true })
export class Log {
  @Prop()
  level: string;

  @Prop()
  message: string;

  @Prop({ default: Date.now, expires: 60 * 60 * 24 * 2 })
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
