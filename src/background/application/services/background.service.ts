import { Injectable } from '@nestjs/common';
import { CreateBackgroundUseCase } from '../use-cases/create-background.usecase';
import { DeleteBackgroundUseCase } from '../use-cases/delete-background.usecase';
import { GetBackgroundUseCase } from '../use-cases/get-background.usecase';
import { UpdateBackgroundUseCase } from '../use-cases/update-background.usecase';
import { CreateBackgroundDto } from '../dto/create-background.dto';
import { UpdateBackgroundDto } from '../dto/update-background.dto';
import { Background } from '../../domain/entities/background.entity';

@Injectable()
export class BackgroundService {
  constructor(
    private readonly createBackgroundUseCase: CreateBackgroundUseCase,
    private readonly deleteBackgroundUseCase: DeleteBackgroundUseCase,
    private readonly getBackgroundUseCase: GetBackgroundUseCase,
    private readonly updateBackgroundUseCase: UpdateBackgroundUseCase,
  ) {}

  async create(file: Express.Multer.File, body: any): Promise<Background> {
    const createBackgroundDto = new CreateBackgroundDto();
    createBackgroundDto.user_create_id = Number(body.user_create_id);
    createBackgroundDto.category_id = Number(body.category_id);
    createBackgroundDto.title = body.title;
    createBackgroundDto.description = body.description;

    return this.createBackgroundUseCase.execute(file, createBackgroundDto);
  }

  async findAll(): Promise<Background[]> {
    return this.getBackgroundUseCase.executeAll();
  }

  async findById(id: number): Promise<Background> {
    return this.getBackgroundUseCase.execute(id);
  }

  async update(
    id: number,
    body: any,
    file?: Express.Multer.File,
  ): Promise<Background> {
    const updateBackgroundDto = new UpdateBackgroundDto();
    // updateBackgroundDto.user_create_id = Number(body.user_create_id);
    updateBackgroundDto.category_id = Number(body.category_id);
    updateBackgroundDto.title = body.title;
    updateBackgroundDto.description = body.description;

    return this.updateBackgroundUseCase.execute(id, updateBackgroundDto, file);
  }

  async delete(id: number): Promise<void> {
    return this.deleteBackgroundUseCase.execute(id);
  }
}
