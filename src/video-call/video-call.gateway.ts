import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class VideoCallGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, data: { room: string; socketId: string }) {
    // Join the client to the specified room
    client.join(data.room);
    // Notify all OTHER clients in the room about the new user (exclude sender)
    client.to(data.room).emit('new user', { socketId: data.socketId });
    console.log(`User ${data.socketId} joined room ${data.room}`);
    // Log all clients in the room for debugging
    const clientsInRoom = this.server.sockets.adapter.rooms.get(data.room);
    console.log(`Clients in room ${data.room}:`, clientsInRoom ? Array.from(clientsInRoom) : []);
  }

  @SubscribeMessage('sdp')
  handleSDP(@MessageBody() data: { description: RTCSessionDescriptionInit; to: string; sender: string }) {
    this.server.to(data.to).emit('sdp', { description: data.description, sender: data.sender });
  }

  @SubscribeMessage('ice candidates')
  handleIceCandidates(@MessageBody() data: { candidate: RTCIceCandidateInit; to: string; sender: string }) {
    this.server.to(data.to).emit('ice candidates', { candidate: data.candidate, sender: data.sender });
  }

  @SubscribeMessage('chat')
  handleChat(@MessageBody() data: { room: string; sender: string; msg: string }) {
    this.server.to(data.room).emit('chat', { sender: data.sender, msg: data.msg });
  }
}