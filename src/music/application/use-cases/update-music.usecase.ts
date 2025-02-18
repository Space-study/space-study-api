import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MusicRepository } from '../../domain/repositories/music.repository';
import { UpdateMusicDto } from '../dto/update-music.dto';
import { Music } from '../../domain/entities/music.entity';

@Injectable()
export class UpdateMusicUseCase {
  constructor(
    @Inject('MusicRepository')
    private readonly musicRepository: MusicRepository,
  ) {}

  async execute(id: number, updateMusicDto: UpdateMusicDto): Promise<Music> {
    const existingMusic = await this.musicRepository.findById(id);
    if (!existingMusic) throw new NotFoundException('Music not found');

    return this.musicRepository.update(id, updateMusicDto);
  }
}
