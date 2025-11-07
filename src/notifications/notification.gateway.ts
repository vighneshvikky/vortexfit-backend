import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationDto } from './dtos/notification.dto';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: [
      process.env.HOST_API,
      process.env.WWW_API,
      process.env.FRONTEND_URL,
    ],
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(userId);
    console.log(`Client ${client.id} joined room ${userId}`);
  }

  sendNotification(userId: string, notification: NotificationDto) {
    console.log('sending new notifiction');
    this.server.to(userId).emit('newNotification', notification);
  }
}
