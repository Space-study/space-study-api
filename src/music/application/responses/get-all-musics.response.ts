import { ApiProperty } from '@nestjs/swagger';
import { GetMusicResponse } from './get-music.response';

export class GetAllMusicResponse {
  @ApiProperty({
    type: [GetMusicResponse],
    description: 'List of all music records.',
  })
  musics: GetMusicResponse[];
}
