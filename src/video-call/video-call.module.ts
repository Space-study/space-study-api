import { Module } from '@nestjs/common';
import { VideoCallService } from './video-call.service';
import { VideoCallGateway } from './video-call.gateway';

@Module({
  providers: [VideoCallGateway, VideoCallService],
})
export class VideoCallModule {}
