import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../../../users/domain/user';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WsAuthUser } from '../../../auth/decorators/ws-auth-user.decorator';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RoomService } from '../../../room/application/services/room.service';
import { MessageService } from '../../message.service';
import { Injectable } from '@nestjs/common';
import { Room } from '../../../room/domain/entities/room.entity';

@ApiTags('Chat WebSocket')
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'chats',
  transports: ['websocket', 'polling'],
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private getRoomChannelName(room: Room): string {
    return `room:${room.getId()}`;
  }

  async handleConnection(client: Socket) {
    try {
      const authToken =
        (client.handshake.headers.token as string) ||
        (client.handshake.auth.token as string);

      if (!authToken) {
        client.disconnect();
        return;
      }

      try {
        const payload = this.jwtService.verify(authToken, {
          secret: this.configService.get('AUTH_JWT_SECRET', { infer: true }),
        });

        const user = await this.userService.findById(payload.id);
        if (!user) {
          client.disconnect();
          return;
        }

        client.data.user = user;
      } catch {
        client.disconnect();
      }
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      if (!client.data || !client.data.user) {
        return;
      }

      const user = client.data.user as User;

      if (!user || !user.id) {
        return;
      }

      const rooms = Array.from(client.rooms || []);
      for (const room of rooms) {
        if (room !== client.id) {
          const sockets = await this.server.in(room).fetchSockets();
          this.server.to(room).emit('userLeft', {
            userId: user.id,
            username: user.firstName,
            timestamp: new Date(),
            activeUsers: sockets.length,
          });
        }
      }
    } catch {
      // Silently handle error
    }
  }

  @ApiOperation({ summary: 'Send message to room' })
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() rawPayload: any,
  ) {
    try {
      console.log('Raw message received:', typeof rawPayload, rawPayload);

      // Parse the payload if it's a string
      let payload;
      if (typeof rawPayload === 'string') {
        try {
          payload = JSON.parse(rawPayload);
          console.log('Parsed string payload:', payload);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          if (rawPayload.includes('"data":')) {
            const dataMatch = rawPayload.match(/"data"\s*:\s*({.*})/);
            if (dataMatch && dataMatch[1]) {
              try {
                payload = JSON.parse(dataMatch[1]);
                console.log('Parsed data section:', payload);
              } catch (e2) {
                console.error('Failed to parse data section:', e2);
                return { error: 'Invalid JSON format in message data' };
              }
            }
          } else {
            return { error: 'Invalid JSON format in message' };
          }
        }
      } else {
        payload = rawPayload.data ? rawPayload.data : rawPayload;
        console.log('Using raw payload:', payload);
      }

      // Get user from socket data
      const user = client.data.user;
      if (!user || !user.id) {
        console.error('No user found for message:', user);
        return { error: 'User not authenticated' };
      }

      // Validate payload
      if (!payload || !payload.roomId || !payload.content) {
        console.log('Invalid payload:', JSON.stringify(payload));
        return {
          error: 'Invalid message data. Both roomId and content are required.',
        };
      }

      console.log('Finding room:', payload.roomId);
      const room = await this.roomService.findById(Number(payload.roomId));
      if (!room) {
        console.log('Room not found:', payload.roomId);
        return { error: 'Room not found' };
      }

      // Log image-specific data if present
      if (
        typeof payload.content === 'string' &&
        payload.content.includes('data:image')
      ) {
        console.log('Image detected in message');
        console.log('Image data length:', payload.content.length);
        console.log('Image format:', payload.content.split(';')[0]);
      }

      // Check if the message is AI generated
      const isAiGenerated = payload.isAiGenerated === true;
      if (isAiGenerated) {
        console.log('Message marked as AI generated');
      }

      // Create message
      console.log('Creating message in room:', room.getId(), {
        contentType: typeof payload.content,
        contentLength: payload.content.length,
        userId: user.id,
        roomId: room.getId(),
        isAiGenerated,
      });

      const message = await this.messageService.create({
        content: payload.content,
        rooms: [room],
        user: user,
        isAiGenerated,
      });

      console.log('Message created successfully:', {
        messageId: message.id,
        timestamp: message.createdAt,
        roomId: room.getId(),
        contentLength: message.content.length,
        isAiGenerated: message.isAiGenerated,
      });

      const roomName = this.getRoomChannelName(room);
      this.server.to(roomName).emit('newMessage', message);
      console.log('Message broadcast to room:', roomName);

      return message;
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        error: 'Failed to send message',
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @ApiOperation({ summary: 'Join room' })
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: number },
  ) {
    try {
      if (!payload || !payload.roomId) {
        return { error: 'RoomId is required' };
      }

      const user = client.data.user;
      if (!user || !user.id) {
        return { error: 'User not authenticated' };
      }

      const room = await this.roomService.findById(payload.roomId);
      if (!room) {
        return { error: 'Room not found' };
      }

      const roomName = this.getRoomChannelName(room);

      const clientRooms = Array.from(client.rooms || []);
      for (const existingRoom of clientRooms) {
        if (existingRoom !== client.id && existingRoom !== roomName) {
          await client.leave(existingRoom);
        }
      }

      await client.join(roomName);

      const sockets = await this.server.in(roomName).fetchSockets();

      this.server.to(roomName).emit('userJoined', {
        userId: user.id,
        username: user.firstName,
        timestamp: new Date(),
        activeUsers: sockets.length,
      });

      return {
        success: true,
        room: room,
        activeUsers: sockets.length,
      };
    } catch (error) {
      return {
        error: 'Failed to join room',
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @ApiOperation({ summary: 'Leave room' })
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: number },
  ) {
    try {
      if (!payload || !payload.roomId) {
        return { error: 'RoomId is required' };
      }

      const user = client.data.user;
      if (!user || !user.id) {
        return { error: 'User not authenticated' };
      }

      const room = await this.roomService.findById(payload.roomId);
      if (!room) {
        return { error: 'Room not found' };
      }

      const roomName = this.getRoomChannelName(room);

      await client.leave(roomName);

      const sockets = await this.server.in(roomName).fetchSockets();

      this.server.to(roomName).emit('userLeft', {
        userId: user.id,
        username: user.firstName,
        timestamp: new Date(),
        activeUsers: sockets.length,
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        error: 'Failed to leave room',
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @ApiOperation({ summary: 'Get room messages' })
  @SubscribeMessage('getRoomMessages')
  async handleGetRoomMessages(
    @ConnectedSocket() client: Socket,
    @WsAuthUser() user: User,
    @MessageBody() payload: { roomId: number; page?: number; limit?: number },
  ) {
    try {
      if (!payload || !payload.roomId) {
        return { error: 'RoomId is required' };
      }

      const room = await this.roomService.findById(payload.roomId);
      if (!room) {
        return { error: 'Room not found' };
      }

      const page = payload.page || 1;
      const limit = payload.limit || 20;

      const [messages, total] =
        await this.messageService.findByRoomIdWithPagination(payload.roomId, {
          page,
          limit,
        });

      return {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return {
        error: 'Failed to get room messages',
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
