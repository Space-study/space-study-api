import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';
//   import { RoomMemberRepository } from '../../domain/repositories/room-member.repository';

@Injectable()
export class JoinRoomUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,

    //   @Inject('RoomMemberRepository')
    //   private readonly roomMemberRepository: RoomMemberRepository,
  ) {}

  async execute(
    roomId: number,
    // userId: number,
    inviteLink?: string,
  ): Promise<void> {
    const room = await this.roomRepository.findById(roomId);
    if (!room) throw new BadRequestException('Room not found');

    // Check privacy and invite link
    if (
      room.getPrivacy() === 'private' &&
      room.getInviteLink() !== inviteLink
    ) {
      throw new UnauthorizedException('Invalid invite link');
    }

    //   // Check if room is full
    //   const memberCount = await this.roomMemberRepository.countByRoomId(roomId);
    //   if (memberCount >= room.getMaxMembers()) {
    //     throw new BadRequestException('Room is full');
    //   }

    //   // Check if user is already a member
    //   const isMember = await this.roomMemberRepository.findMember(roomId, userId);
    //   if (isMember) throw new BadRequestException('User is already a member');

    //   // Add user to room
    //   await this.roomMemberRepository.addMember(roomId, userId);
  }
}
