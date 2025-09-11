import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './schemas/message.schema';
import { MessageController } from './controller/messages.controller';
import { MessageService } from './service/implementation/messages.service';
import { MessageRepository } from './repository/implementation/messages.repository';
import { MESSAGE_SERVICE } from './service/interface/message.service.interface';
import { MESSAGE_REPOSITORY } from './repository/interface/messages.repository.interface';
import { MessageMapper } from './mappers/message.mapper';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatMessage.name, schema: ChatMessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageMapper,
    {
 provide: MESSAGE_SERVICE,
 useClass: MessageService
  },
  {
    provide: MESSAGE_REPOSITORY,
    useClass: MessageRepository
  }

],
  exports: [MessageService],
})
export class MessageModule {}
