import { Inject, Injectable } from '@nestjs/common';
import { MessageRepository } from '../../repository/implementation/messages.repository';
import {
  IMessageRepository,
  MESSAGE_REPOSITORY,
} from '../../repository/interface/messages.repository.interface';
import { IMessageService } from '../interface/message.service.interface';
import { ChatMessage } from '../../schemas/message.schema';
import { MessageMapper } from 'src/messages/mappers/message.mapper';
import { MessageResponseDto } from 'src/messages/dtos/send-message.dto';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly _messageRepository: IMessageRepository,
    private readonly _messageMapper: MessageMapper,
  ) {}

  async saveMessage(
    senderId: string,
    receiverId: string,
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
}
