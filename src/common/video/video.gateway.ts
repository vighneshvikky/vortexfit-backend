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
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface RoomUser {
  userId: string;
  socketId: string;
  approved?: boolean;
}

@WebSocketGateway({ namespace: '/video', cors: { origin: '*' } })
export class VideoGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private rooms: Map<string, RoomUser[]> = new Map();

  constructor(
    @Inject(ISUBSCRIPTIONSERVICE)
    private readonly _subscriptionService: ISubscriptionService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.auth?.userId;

      if (!userId) {
        client.emit('error', { message: 'Unauthorized: No user ID' });
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

     
    } catch (error) {
      console.error('Error verifying subscription:', error);
      client.emit('error', { message: 'Subscription check failed' });
      client.disconnect(true);
    }
  }

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

  removeBlockedUser(userId: string) {
    for (const [sessionId, users] of this.rooms.entries()) {
      const blockedUser = users.find((u) => u.userId === userId);
      if (blockedUser) {
        this.server.to(blockedUser.socketId).emit('blocked', {
          sessionId,
          reason: 'Admin blocked you',
        });

        this.server.sockets.sockets.get(blockedUser.socketId)?.disconnect(true);

        this.rooms.set(
          sessionId,
          users.filter((u) => u.userId !== userId),
        );
        this.server.to(sessionId).emit('user-left', { userId, sessionId });
      }
    }
  }
}
