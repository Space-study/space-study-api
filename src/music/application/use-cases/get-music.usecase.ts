import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MusicRepository } from '../../domain/repositories/music.repository';
import { Music } from '../../domain/entities/music.entity';

@Injectable()
export class GetMusicUseCase {
  constructor(
    @Inject('MusicRepository')
    private readonly musicRepository: MusicRepository,
  ) {}

  async execute(id: number): Promise<Music> {
    const music = await this.musicRepository.findById(id);
    if (!music) throw new NotFoundException('Music not found');
<<<<<<< HEAD

=======
>>>>>>> c73b98b8c91de213f04bd99370555d147ff97925
    return music;
  }

  async executeAll(): Promise<Music[]> {
    return this.musicRepository.findAll();
  }
}
