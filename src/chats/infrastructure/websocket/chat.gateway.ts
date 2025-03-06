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
import { ChatsService } from '../../chats.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WsAuthUser } from '../../../auth/decorators/ws-auth-user.decorator';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/users.service';
import { ConfigService } from '@nestjs/config';

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
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authToken = client.handshake.auth.token;
      console.log(
        'Connection attempt with token:',
        authToken ? 'Present' : 'Missing',
      );

      if (!authToken) {
        console.log('Disconnecting client: No auth token provided');
        client.disconnect();
        return;
      }

      try {
        const payload = this.jwtService.verify(authToken as string, {
          secret: this.configService.get('AUTH_JWT_SECRET', { infer: true }),
        });

        console.log('JWT verified, user ID:', payload.id);

        const user = await this.userService.findById(payload.id);
        if (!user) {
          console.log('Disconnecting client: User not found');
          client.disconnect();
          return;
        }

        // Store user data in socket
        client.data.user = user;

        // Get all user's chats and join their rooms
        const chats = await this.chatsService.findUserChats(user.id);
        console.log(`User ${user.id} has ${chats.length} chats`);

        // Join all chat rooms
        for (const chat of chats) {
          const roomName = `chat:${chat.id}`;
          await client.join(roomName);
          console.log(`User ${user.id} joined room ${roomName}`);
        }

        // Log all rooms this client is in
        const rooms = Array.from(client.rooms || []);
        console.log('Client rooms:', rooms);
      } catch (error) {
        console.error('Error during connection:', error);
        client.disconnect();
      }
    } catch (error) {
      console.error('Unexpected error during connection:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      console.log('Client disconnecting:', client.id);

      // Check if user data exists
      if (!client.data || !client.data.user) {
        console.log('No user data for disconnecting client');
        return;
      }

      const user = client.data.user as User;

      // Check if user has an id
      if (!user || !user.id) {
        console.log('User has no ID, skipping room leave');
        return;
      }

      // Get all rooms the client is in
      const rooms = Array.from(client.rooms || []);
      for (const room of rooms) {
        if (room !== client.id) {
          // Skip the socket's default room
          const chatId = room.replace('chat:', '');
          // Remove user from chat participants when disconnecting
          await this.chatsService.removeParticipant(
            chatId as string,
            user.id.toString(),
          );
          console.log(
            `Removed user ${user.id} from chat ${chatId} due to disconnect`,
          );

          // Notify other users in the room
          const sockets = await this.server.in(room).fetchSockets();
          this.server.to(room).emit('userLeft', {
            userId: user.id,
            username: user.firstName,
            timestamp: new Date(),
            activeUsers: sockets.length,
          });
        }
      }
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }

  @ApiOperation({ summary: 'Send message to chat' })
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @WsAuthUser() user: User,
    @MessageBody() rawPayload: any,
  ) {
    try {
      console.log('Raw message received:', typeof rawPayload, rawPayload);

      // Parse the payload if it's a string
      let payload;
      if (typeof rawPayload === 'string') {
        try {
          // Try to parse the string as JSON
          payload = JSON.parse(rawPayload);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // If it contains "data": {...} format, try to extract and parse that part
          if (rawPayload.includes('"data":')) {
            const dataMatch = rawPayload.match(/"data"\s*:\s*({.*})/);
            if (dataMatch && dataMatch[1]) {
              try {
                payload = JSON.parse(dataMatch[1]);
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
        // It's already an object
        payload = rawPayload.data ? rawPayload.data : rawPayload;
      }

      // Validate payload
      if (!payload || !payload.chatId || !payload.content) {
        console.log('Invalid payload:', JSON.stringify(payload));
        return {
          error: 'Invalid message data. Both chatId and content are required.',
        };
      }

      // Check if user exists
      if (!user || !user.id) {
        return { error: 'User not authenticated' };
      }

      console.log('Finding chat:', payload.chatId);
      const chat = await this.chatsService.findById(payload.chatId);
      if (!chat) {
        console.log('Chat not found:', payload.chatId);
        return { error: 'Chat not found' };
      }

      console.log('Creating message in chat:', chat.id);
      const message = await this.chatsService.createMessage({
        chatId: chat.id,
        content: payload.content,
        userId: user.id.toString(),
      });

      const roomName = `chat:${chat.id}`;
      this.server.to(roomName).emit('newMessage', message);

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      // Convert error to a plain object to avoid instanceof issues
      return {
        error: 'Failed to send message',
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  @ApiOperation({ summary: 'Join chat room' })
  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @WsAuthUser() user: User,
    @MessageBody() payload: { chatId: string },
  ) {
    try {
      if (!payload || !payload.chatId) {
        return { error: 'ChatId is required' };
      }

      console.log('Join chat request:', payload.chatId, 'from user:', user.id);

      const chat = await this.chatsService.findById(payload.chatId);
      if (!chat) {
        console.log('Chat not found for joining:', payload.chatId);
        return { error: 'Chat not found' };
      }

      // Add user as participant if not already a participant
      const isParticipant = chat.participants.some((p) => p.id === user.id);
      if (!isParticipant) {
        // Add user to chat participants
        await this.chatsService.addParticipant(
          chat.id as string,
          user.id.toString(),
        );
        console.log(`Added user ${user.id} as participant to chat ${chat.id}`);
      }

      const roomName = `chat:${chat.id}`;
      await client.join(roomName);
      console.log(`Joined room: ${roomName}`);

      // Get the number of clients in this room
      const sockets = await this.server.in(roomName).fetchSockets();
      const activeUsers = sockets.length;
      console.log(`Number of clients in room ${roomName}:`, activeUsers);

      // Notify other users in the room
      this.server.to(roomName).emit('userJoined', {
        userId: user.id,
        username: user.firstName,
        timestamp: new Date(),
        activeUsers,
      });

      return {
        success: true,
        roomName,
        activeUsers,
      };
    } catch (error) {
      console.error('Error joining chat:', error);
      return { error: 'Failed to join chat' };
    }
  }

  @ApiOperation({ summary: 'Leave chat room' })
  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @WsAuthUser() user: User,
    @MessageBody() payload: { chatId: string },
  ) {
    try {
      const roomName = `chat:${payload.chatId}`;
      await client.leave(roomName);

      // Remove user from chat participants
      await this.chatsService.removeParticipant(
        payload.chatId as string,
        user.id.toString(),
      );
      console.log(`Removed user ${user.id} from chat ${payload.chatId}`);

      // Get updated number of clients in the room
      const sockets = await this.server.in(roomName).fetchSockets();
      const activeUsers = sockets.length;

      // Notify other users in the room
      this.server.to(roomName).emit('userLeft', {
        userId: user.id,
        username: user.firstName,
        timestamp: new Date(),
        activeUsers,
      });

      console.log(`User ${user.id} left room ${roomName}`);
      return { success: true };
    } catch (error) {
      console.error('Error leaving chat:', error);
      return { error: 'Failed to leave chat' };
    }
  }

  @ApiOperation({ summary: 'Get chat messages' })
  @SubscribeMessage('getChatMessages')
  async handleGetChatMessages(
    @ConnectedSocket() client: Socket,
    @WsAuthUser() user: User,
    @MessageBody() payload: { chatId: string; page?: number; limit?: number },
  ) {
    try {
      console.log('Get chat messages request:', payload);

      if (!payload || !payload.chatId) {
        console.log('Invalid payload or chatId is missing');
        return {
          error: 'Invalid request. chatId is required.',
        };
      }

      const chat = await this.chatsService.findById(payload.chatId);
      if (!chat) {
        console.log('Chat not found:', payload.chatId);
        return { error: 'Chat not found' };
      }

      // Verify user is a participant
      const isParticipant = chat.participants.some((p) => p.id === user.id);
      if (!isParticipant) {
        return { error: 'Not a participant' };
      }

      // Get messages with pagination
      const messages = await this.chatsService.getChatMessages({
        chatId: payload.chatId,
        paginationOptions: {
          page: payload.page || 1,
          limit: payload.limit || 20,
        },
      });

      return messages;
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return { error: 'Failed to get chat messages' };
    }
  }
}
