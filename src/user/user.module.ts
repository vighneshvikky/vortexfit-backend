import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { User, UserSchema } from './user.schema';
import { HashingService } from 'src/auth/services/hashing.service';
import { AuthModule } from '../auth/auth.module';
import { MailService } from 'src/common/utils/mailer/mailer.service';
import { TempUserRepository } from 'src/auth/repository/temp-user.repository';
import { TempUser, TempUserSchema } from 'src/auth/schema/temp-user.schema';
import { DatabaseModule } from 'src/database/database.module';


@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
  ],  
  providers: [UserService, UserRepository, HashingService, MailService, TempUserRepository],
  exports: [UserService],
})
export class UsersModule {}
