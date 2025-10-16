import {
  ISubscriptionService,
  ISUBSCRIPTIONSERVICE,
} from '@/subscription/service/interface/ISubscription.service';
import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from 'src/messages/schemas/message.schema';
import {
  IMessageService,
  MESSAGE_SERVICE,
} from 'src/messages/service/interface/message.service.interface';
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: [
      'https://vortex-fit.space',
      'https://www.vortex-fit.space',
      process.env.FRONTEND_URL,
    ],
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(MESSAGE_SERVICE) private readonly messageService: IMessageService,
    @Inject(ISUBSCRIPTIONSERVICE)
    private readonly _subscriptionService: ISubscriptionService,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;

    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      client.disconnect(true);
      return;
    }

    const hasActiveSub =
      await this._subscriptionService.hasActiveSubscription(userId);

    if (hasActiveSub) {
      client.emit('error', { message: 'No active subscription' });
      client.disconnect(true);
      return;
    }
  }

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
  async handleMessage(@MessageBody() message: ChatMessage) {
    console.log('Received message:', message);

    const senderObjId = new Types.ObjectId(message.senderId);
    const receiverObjId = new Types.ObjectId(message.receiverId);

    const saved = await this.messageService.saveMessage(
      senderObjId,
      receiverObjId,
      message.content,
    );

    const roomId = [message.senderId, message.receiverId].sort().join('_');
    console.log('Broadcasting message to room:', roomId);
    this.server.to(message.roomId).emit('message', saved);
  }
}
