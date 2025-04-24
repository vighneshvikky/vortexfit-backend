import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from 'src/auth/schema/otp.schema';
import { TempUser, TempUserSchema } from 'src/auth/schema/temp-user.schema';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/vortexfit'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
      {name: TempUser.name, schema: TempUserSchema}
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
