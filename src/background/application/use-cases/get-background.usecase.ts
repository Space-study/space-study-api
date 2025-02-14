import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BackgroundRepository } from '../../domain/repositories/background.repository';
import { Background } from '../../domain/entities/background.entity';

@Injectable()
export class GetBackgroundUseCase {
  constructor(
    @Inject('BackgroundRepository')
    private readonly backgroundRepository: BackgroundRepository,
  ) {}

  async execute(id: number): Promise<Background> {
    const background = await this.backgroundRepository.findById(id);
    if (!background) throw new NotFoundException('Background not found');

    return background;
  }

  async executeAll(): Promise<Background[]> {
    return this.backgroundRepository.findAll();
  }
}
