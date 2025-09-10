// import { Inject, UnauthorizedException } from '@nestjs/common';

// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import {
//   IJwtTokenService,
//   JWT_SERVICE,
// } from 'src/auth/interfaces/ijwt-token-service.interface';
// import { SendMessageDto } from 'src/messages/dtos/send-message.dto';
// import { MessageService } from 'src/messages/service/messages.service';
// import cookie from 'cookie';

// const userRoom = (id: string) => `user:${id}`;

// @WebSocketGateway({
//   cors: {
//     origin: process.env.FRONTEND_URL || '*',
//     credentials: true,
//   },
//   namespace: '/',
// })
// export class ChatGateway implements OnGatewayConnection {
//   @WebSocketServer() server!: Server;

//   constructor(
//     private readonly messages: MessageService,
//     @Inject(JWT_SERVICE) private readonly jwtService: IJwtTokenService,
//   ) {}

//   async handleConnection(client: Socket) {
//     try {
//       const cookies = cookie.parse(client.handshake.headers.cookie || '');

//       const token =
//         cookies['access_token'] ||
//         (client.handshake.auth?.token as string) ||
//         (client.handshake.query?.token as string);

//       if (!token) throw new UnauthorizedException('Missing Token');

//       const payload = this.jwtService.verifyToken(token);

//       (client as any).user = { id: payload.sub, role: payload.role };
//       client.join(userRoom(payload.sub));
//       client.emit('connected', { userId: payload.sub });
//     } catch (error) {
//       client.emit('error', { message: 'Unauthorized' });
//       client.disconnect();
//     }
//   }

//   @SubscribeMessage('send_message')
//   async onSendMessage(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() body: SendMessageDto,
//   ) {
//     const me = (client as any).user?.id as string;
//     if (!me) return;

//     const saved = await this.messages.saveMessage(
//       me,
//       body.receiverId,
//       body.content,
//     );

//     //emit to receiver room
//     this.server.to(userRoom(body.receiverId)).emit('receive_message', saved);
//     // also echo back to sender so UI updated instantly (if you maintain source of truth form server)
//     client.emit('receive_message', saved);

//     //optional ack flow (Socket.IO built-in): client can pass a callback
//     return { ok: true, id: saved._id };
//   }
// }


import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { MessageService } from '../service/messages.service';
// import { ChatMessage } from '../schemas/message.schema';
import { MessageService } from 'src/messages/service/messages.service';
import { ChatMessage } from 'src/messages/schemas/message.schema';
@WebSocketGateway({
  cors: {
    origin: '*', // restrict in production
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.leave(roomId);
    console.log(`Client ${client.id} left room ${roomId}`);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() message: ChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Received message:', message);

    // save in DB
    const saved = await this.messageService.saveMessage(
      message.senderId,
      message.receiverId,
      message.content,
    );

    // broadcast to room (both sender & receiver)
    const roomId = [message.senderId, message.receiverId].sort().join('_');
     console.log('Broadcasting message to room:', roomId);
    this.server.to(message.roomId).emit('message', saved);
  }
}
