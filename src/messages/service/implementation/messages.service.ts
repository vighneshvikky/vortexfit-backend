import { Inject, Injectable } from '@nestjs/common';
import {
  IMessageRepository,
  MESSAGE_REPOSITORY,
} from '../../repository/interface/messages.repository.interface';
import { IMessageService } from '../interface/message.service.interface';
import { MessageMapper } from 'src/messages/mappers/message.mapper';
import { MessageResponseDto } from 'src/messages/dtos/send-message.dto';
import { Types } from 'mongoose';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly _messageRepository: IMessageRepository,
    private readonly _messageMapper: MessageMapper,
  ) {}

  async saveMessage(
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    content: string,

  ): Promise<MessageResponseDto> {
    const message = await this._messageRepository.saveMessage(
      senderId,
      receiverId,
      content,

    );
    return this._messageMapper.toDto(message);
  }

  async getHistory(
    roomId: string,
    skip?: number,
    limit?: number,
  ): Promise<MessageResponseDto[]> {
    const messages = await this._messageRepository.getHistory(
      roomId,
      skip,
      limit,
    );
    return this._messageMapper.toDtoList(messages);
  }
  async getAllChatsByUserOrTrainer(userId: string, role: string) {
 
    return  await this._messageRepository.getAllChatsByUserOrTrainer(userId, role);

   
  }
}
