import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MusicRepository } from '../../domain/repositories/music.repository';

@Injectable()
export class DeleteMusicUseCase {
  constructor(
    @Inject('MusicRepository')
    private readonly musicRepository: MusicRepository,
  ) {}
<<<<<<< HEAD

=======
  
>>>>>>> c73b98b8c91de213f04bd99370555d147ff97925
  async execute(id: number): Promise<void> {
    const music = await this.musicRepository.findById(id);
    if (!music) throw new NotFoundException('Music not found');
    return this.musicRepository.delete(id);
  }
}
