import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BackgroundRepository } from '../../domain/repositories/background.repository';

@Injectable()
export class DeleteBackgroundUseCase {
  constructor(
    @Inject('BackgroundRepository')
    private readonly repository: BackgroundRepository,
  ) {}

  async execute(background_id: number): Promise<void> {
    const existingBackground = await this.repository.findById(background_id);
    if (!existingBackground) {
      throw new NotFoundException(
        `Background with ID ${background_id} not found`,
      );
    }

    await this.repository.delete(background_id);
  }
}
