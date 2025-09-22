import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface RoomUser {
  userId: string;
  socketId: string;
  approved?: boolean;
}

@WebSocketGateway({ namespace: '/video', cors: { origin: '*' } })
export class VideoGateway {
  @WebSocketServer()
  server: Server;

  private rooms: Map<string, RoomUser[]> = new Map();

  @SubscribeMessage('join-video-room')
  handleJoin(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, userId } = data;
    console.log('Video: handle join', sessionId, userId);

    if (!this.rooms.has(sessionId)) {
      this.rooms.set(sessionId, []);
    }

    const users = this.rooms.get(sessionId)!;
    users.push({ userId, socketId: client.id });

    client.join(sessionId);
    client.to(sessionId).emit('user-joined', { userId, sessionId });

    console.log(`Video: User ${userId} joined room ${sessionId}`);
  }

  @SubscribeMessage('leave-video-room')
  handleLeave(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, userId } = data;

    const users = this.rooms.get(sessionId);
    if (users) {
      const updatedUsers = users.filter((u) => u.socketId !== client.id);
      if (updatedUsers.length > 0) {
        this.rooms.set(sessionId, updatedUsers);
      } else {
        this.rooms.delete(sessionId);
      }
    }

    client.leave(sessionId);
    client.to(sessionId).emit('user-left', { userId, sessionId });

    console.log(`Video: User ${userId} left room ${sessionId}`);
  }

  @SubscribeMessage('signal')
  handleSignal(
    @MessageBody()
    data: {
      sessionId: string;
      targetUserId?: string;
      signal: string;
      type: string;
      to?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const users = this.rooms.get(data.sessionId) || [];

    const targetId = data.targetUserId || data.to;
    const target = users.find((u) => u.userId === targetId);

    if (target) {
      this.server.to(target.socketId).emit('signal', {
        type: data.type,
        data: data.signal,
        sessionId: data.sessionId,
        from: client.handshake.auth.userId,
      });
    } else {
      console.warn(
        `[Signal failed] No target found for ${targetId}. Available users:`,
        users.map((u) => u.userId),
      );
    }
  }
  @SubscribeMessage('approve-user')
  handleApproveUser(
    @MessageBody() data: { sessionId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomUsers = this.rooms.get(data.sessionId) || [];
    const user = roomUsers.find((u) => u.userId === data.userId);
    if (user) {
      user.approved = true;
      this.server
        .to(user.socketId)
        .emit('user-approved', { sessionId: data.sessionId });
    }
  }
}
