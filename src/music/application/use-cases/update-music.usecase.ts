import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MusicRepository } from '../../domain/repositories/music.repository';
import { UpdateMusicDto } from '../dto/update-music.dto';
import { Music } from '../../domain/entities/music.entity';
import { MinioService } from '../../infrastructure/services/minio.service';

@Injectable()
export class UpdateMusicUseCase {
  constructor(
    @Inject('MusicRepository')
    private readonly musicRepository: MusicRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(
    id: number,
    updateMusicDto: UpdateMusicDto,
    file?: Express.Multer.File,
  ): Promise<Music> {
    const existingMusic = await this.musicRepository.findById(id);
    if (!existingMusic) {
      throw new NotFoundException(`Music with ID ${id} not found`);
    }

    if (file) {
      const fileUrl = await this.minioService.uploadFile(file);
      updateMusicDto.path = fileUrl;
    }
  
    const updatedData: UpdateMusicDto = {
      title: updateMusicDto.title ?? existingMusic.title,
      category_id: updateMusicDto.category_id ?? existingMusic.category_id,
      path: updateMusicDto.path ?? existingMusic.path,
    };
  
    return this.musicRepository.update(id, updatedData);
  }
  
}
