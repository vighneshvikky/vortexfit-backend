import { IsString } from 'class-validator';


export class SendMessageDto {
@IsString() receiverId!: string;
@IsString() content!: string;
}