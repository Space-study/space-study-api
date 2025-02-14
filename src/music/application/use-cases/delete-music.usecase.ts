import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MusicRepository } from '../../domain/repositories/music.repository';

@Injectable()
export class DeleteMusicUseCase {
  constructor(
    @Inject('MusicRepository')
    private readonly musicRepository: MusicRepository,
  ) {}
  
  async execute(id: number): Promise<void> {
    const music = await this.musicRepository.findById(id);
    if (!music) throw new NotFoundException('Music not found');
    return this.musicRepository.delete(id);
  }
}
