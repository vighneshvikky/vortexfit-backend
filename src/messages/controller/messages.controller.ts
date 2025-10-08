import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import {
  IMessageService,
  MESSAGE_SERVICE,
} from '../service/interface/message.service.interface';
import { GetUser } from '@/common/decorator/get-user.decorator';

@Controller('chat')
export class MessageController {
  constructor(
    @Inject(MESSAGE_SERVICE) private readonly _messageService: IMessageService,
  ) {}

  @Get('messages/:roomId')
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    const skip = (Number(page) - 1) * Number(limit);
    const data = await this._messageService.getHistory(
      roomId,
      skip,
      parseInt(limit),
    );

    return data;
  }

  @Get('messages')
  async getAllUserChats(@GetUser('sub') userId: string, @GetUser('role') role: string) {
    return await this._messageService.getAllChatsByUserOrTrainer(userId, role);
  }
}
