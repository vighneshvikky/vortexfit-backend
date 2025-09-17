import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from 'src/messages/schemas/message.schema';
import { IMessageService, MESSAGE_SERVICE } from 'src/messages/service/interface/message.service.interface';
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(MESSAGE_SERVICE) private readonly messageService: IMessageService) {}

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) { 
    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(roomId);
    console.log(`Client ${client.id} left room ${roomId}`);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() message: ChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Received message:', message);

    const saved = await this.messageService.saveMessage(
      message.senderId,
      message.receiverId,
      message.content,
    );

    const roomId = [message.senderId, message.receiverId].sort().join('_');
    console.log('Broadcasting message to room:', roomId);
    this.server.to(message.roomId).emit('message', saved);
  }
}
