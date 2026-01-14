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
     console.log('🔌 Notifications connected:', client.id);
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
/**
   * Send a new notification to user
   */
  sendNotification(userId: string, notification: NotificationDto) {
    console.log('📤 Sending new notification to user:', userId);
    this.server.to(userId).emit('newNotification', notification);
  }

  /**
   * Notify that a notification was marked as read
   */
  notifyNotificationRead(userId: string, notificationId: string) {
    console.log('📖 Notifying notification read:', notificationId);
    this.server.to(userId).emit('notificationRead', { notificationId });
  }

  /**
   * Notify that all notifications were marked as read
   */
  notifyAllNotificationsRead(userId: string) {
    console.log('📚 Notifying all notifications marked as read for user:', userId);
    this.server.to(userId).emit('allNotificationsRead', { userId });
  }

  /**
   * Notify that a notification was deleted
   */
  notifyNotificationDeleted(userId: string, notificationId: string) {
    console.log('🗑️ Notifying notification deleted:', notificationId);
    this.server.to(userId).emit('notificationDeleted', { notificationId });
  }

  /**
   * Send updated unread count to user
   */
  notifyUnreadCountUpdate(userId: string, count: number) {
    console.log('🔢 Sending unread count update to user:', userId, 'count:', count);
    this.server.to(userId).emit('unreadCountUpdate', { count });
  }

}
