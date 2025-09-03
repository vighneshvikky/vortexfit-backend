import { Controller, Get, Query, Req } from '@nestjs/common';
import { MessageService } from '../service/messages.service';
import { FetchHistoryDto } from '../dtos/fetch-history.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('history')
  async history(@GetUser('sub') userId: string, @Query() q: FetchHistoryDto) {
    return this.messageService.getHistory(userId, q.peerId, q.skip, q.limit);
  }
}
