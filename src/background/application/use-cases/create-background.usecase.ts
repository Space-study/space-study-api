import { Inject, Injectable } from '@nestjs/common';
import { BackgroundRepository } from '../../domain/repositories/background.repository';
import { MinioService } from '../../infrastructure/services/minio.service';
import { CreateBackgroundDto } from '../dto/create-background.dto';
import { Background } from '../../domain/entities/background.entity';

@Injectable()
export class CreateBackgroundUseCase {
  constructor(
    @Inject('BackgroundRepository')
    private readonly backgroundRepository: BackgroundRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(
    file: Express.Multer.File,
    createBackgroundDto: CreateBackgroundDto,
  ): Promise<Background> {
    const fileUrl = await this.minioService.uploadFile(file);

    const background = new Background(
      0,
      createBackgroundDto.user_create_id,
      createBackgroundDto.category_id,
      fileUrl,
      createBackgroundDto.title,
      createBackgroundDto.description || '',
      new Date(),
    );

    return this.backgroundRepository.create(background);
  }
}
