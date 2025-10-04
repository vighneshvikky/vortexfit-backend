import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  IAIService,
  IAISERVICE,
} from '../service/interface/ai.service.interface';

@Controller('ai')
export class AiController {
  constructor(@Inject(IAISERVICE) private readonly _aiService: IAIService) {}

  @Post('chat')
  async chat(@Body() body: { message: string; personality: string }) {
    const { message, personality } = body;
    const reply = await this._aiService.chatWithAI(message, personality);
    return { reply };
  }
}
