import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BackgroundRepository } from '../../domain/repositories/background.repository';
import { MinioService } from '../../infrastructure/services/minio.service';
import { UpdateBackgroundDto } from '../dto/update-background.dto';
import { Background } from '../../domain/entities/background.entity';

@Injectable()
export class UpdateBackgroundUseCase {
  constructor(
    @Inject('BackgroundRepository')
    private readonly backgroundRepository: BackgroundRepository,
    private readonly minioService: MinioService,
  ) {}

  async execute(
    id: number,
    updateBackgroundDto: UpdateBackgroundDto,
    file?: Express.Multer.File,
  ): Promise<Background> {
    const existingBackground = await this.backgroundRepository.findById(id);
    if (!existingBackground) {
      throw new NotFoundException(`Background with ID ${id} not found`);
    }

    if (file) {
      const fileUrl = await this.minioService.uploadFile(file);
      updateBackgroundDto.thumbnail_path = fileUrl;
    }

    const updatedData: UpdateBackgroundDto = {
      title: updateBackgroundDto.title ?? existingBackground.title,
      description:
        updateBackgroundDto.description ?? existingBackground.description,
      category_id:
        updateBackgroundDto.category_id ?? existingBackground.category_id,
      user_create_id:
        updateBackgroundDto.user_create_id ?? existingBackground.user_create_id,
      thumbnail_path:
        updateBackgroundDto.thumbnail_path ?? existingBackground.thumbnail_path,
    };

    return this.backgroundRepository.update(id, updatedData);
  }
}
