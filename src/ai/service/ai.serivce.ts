import { BadRequestException, Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import path from 'path';
import fs from 'fs';
import { IAIService } from './interface/ai.service.interface';

@Injectable()
export class AiService implements IAIService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  private loadPrompt(personality: string): string {
    const allowed = ['trainer', 'nutritionist', 'motivator'];

    if (!allowed.includes(personality))
      throw new BadRequestException('Invalid AI personality');

    const promptPath = path.join(
      process.cwd(),
      'src/prompts/fitness-coach.txt',
    );

    return fs.readFileSync(promptPath, 'utf-8');
  }

  async chatWithAI(userMessage: string, personality: string): Promise<string> {
    const systemPrompt = this.loadPrompt(personality);
    const response = await this.groq.chat.completions.create({
      model: 'moonshotai/kimi-k2-instruct-0905',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    });

    return response.choices[0].message?.content || '⚠️ No response from AI.';
  }
}
