import { Module } from '@nestjs/common';
import { MessageModule } from 'src/messages/message.module';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import {
  JWT_SERVICE,
} from 'src/auth/interfaces/ijwt-token-service.interface';
import { JwtTokenService } from 'src/auth/services/jwt/jwt.service';

@Module({
  imports: [MessageModule, JwtModule.register({})],
  providers: [
    ChatGateway,
    {
      provide: JWT_SERVICE,
      useClass: JwtTokenService,
    },
  ],
  exports: [JWT_SERVICE],
})
export class ChatModule {}
