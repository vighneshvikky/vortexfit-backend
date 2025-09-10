import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { MessageService } from '../service/messages.service';
import { FetchHistoryDto } from '../dtos/fetch-history.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { ChatMessage } from '../schemas/message.schema';
import { CreateMessageDto } from '../interfaces/message.interface';

@Controller('chat')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

@Post('messages')
async sendMessage(@Body() messageData: CreateMessageDto) {
  console.log('messageData', messageData)
  const { senderId, receiverId, content } = messageData;
  return this.messageService.saveMessage(senderId, receiverId, content);
}


  @Get('messages/:roomId')
  async getMessages(
    @Param('roomId') roomId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const data = await this.messageService.getHistory(roomId, skip, parseInt(limit));

    return data;
  }
}
