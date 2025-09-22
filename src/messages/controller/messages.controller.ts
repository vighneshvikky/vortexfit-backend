import { Body, Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { MessageService } from '../service/implementation/messages.service';
import {
  IMessageService,
  MESSAGE_SERVICE,
} from '../service/interface/message.service.interface';

@Controller('chat')
export class MessageController {
  constructor(
    @Inject(MESSAGE_SERVICE) private readonly messageService: IMessageService,
  ) {}

  @Get('messages/:roomId')
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    const skip = (Number(page) - 1) * Number(limit);
    const data = await this.messageService.getHistory(
      roomId,
      skip,
      parseInt(limit),
    );

    return data;
  }
}
