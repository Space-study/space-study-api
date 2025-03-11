// src/video-call/video-call.service.ts
import { Injectable } from '@nestjs/common';
import { CreateVideoCallDto } from './dto/create-video-call.dto';

@Injectable()
export class VideoCallService {
  private rooms: { [key: string]: string[] } = {};
  private socketMap: { [key: string]: string } = {};

  create(createVideoCallDto: CreateVideoCallDto): string {
    const roomId = createVideoCallDto.roomId || `room-${Date.now()}`;
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = [];
    }
    return roomId;
  }

  addUserToRoom(roomId: string, userId: string, socketId: string) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = [];
    }
    if (!this.rooms[roomId].includes(userId)) {
      this.rooms[roomId].push(userId);
      this.socketMap[socketId] = userId;
    }
  }

  removeUserFromRoom(userId: string) {
    for (const roomId in this.rooms) {
      this.rooms[roomId] = this.rooms[roomId].filter((id) => id !== userId);
      if (this.rooms[roomId].length === 0) {
        delete this.rooms[roomId];
      }
    }
    for (const socketId in this.socketMap) {
      if (this.socketMap[socketId] === userId) {
        delete this.socketMap[socketId];
      }
    }
  }

  getUserIdBySocketId(socketId: string): string | undefined {
    return this.socketMap[socketId];
  }

  findAll() {
    return Object.keys(this.rooms).map((roomId) => ({
      roomId,
      users: this.rooms[roomId],
    }));
  }
}