import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BackgroundRepository } from '../../domain/repositories/background.repository';
import { UpdateBackgroundDto } from '../dto/update-background.dto';
import { Background } from '../../domain/entities/background.entity';

@Injectable()
export class UpdateBackgroundUseCase {
  constructor(
    @Inject('BackgroundRepository')
    private readonly backgroundRepository: BackgroundRepository,
  ) {}

  async execute(
    id: number,
    updateBackgroundDto: UpdateBackgroundDto,
  ): Promise<Background> {
    const existingBackground = await this.backgroundRepository.findById(id);
    if (!existingBackground) {
      throw new NotFoundException(`Background with ID ${id} not found`);
    }

    return this.backgroundRepository.update(id, updateBackgroundDto);
  }
}
