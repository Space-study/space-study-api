import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MusicRepository } from '../../domain/repositories/music.repository';
import { Music } from '../../domain/entities/music.entity';

@Injectable()
export class GetMusicUseCase {
  constructor(
    @Inject('MusicRepository')
    private readonly musicRepository: MusicRepository) {}

  async execute(id: number): Promise<Music> {
    const music = await this.musicRepository.findById(id);
    if (!music) throw new NotFoundException('Music not found');
    
    return music;
  }

  async executeAll(): Promise<Music[]> {
    return this.musicRepository.findAll();
  }
}
