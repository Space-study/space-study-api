import { Inject, Injectable } from '@nestjs/common';
import { MusicRepository } from '../../domain/repositories/music.repository';
import { MinioService } from '../../infrastructure/services/minio.service';
import { CreateMusicDto } from '../dto/create-music.dto';
import { Music } from '../../domain/entities/music.entity';

@Injectable()
export class CreateMusicUseCase {
  constructor(
    @Inject('MusicRepository')
    private readonly musicRepository: MusicRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(
    file: Express.Multer.File,
    createMusicDto: CreateMusicDto,
  ): Promise<Music> {
    const fileUrl = await this.minioService.uploadFile(file); // Upload file to MinIO

    const music = new Music(
      0, // ID will be assigned by the database
      createMusicDto.user_create_id,
      createMusicDto.category_id,
      fileUrl, // Store the MinIO file URL in the database
      createMusicDto.title,
      new Date(),
    );

    return this.musicRepository.create(music);
  }
}
