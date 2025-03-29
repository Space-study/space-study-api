import { Injectable } from '@nestjs/common';
import { CreateMusicUseCase } from '../use-cases/create-music.usecase';
import { DeleteMusicUseCase } from '../use-cases/delete-music.usecase';
import { GetMusicUseCase } from '../use-cases/get-music.usecase';
import { UpdateMusicUseCase } from '../use-cases/update-music.usecase';
import { CreateMusicDto } from '../dto/create-music.dto';
import { UpdateMusicDto } from '../dto/update-music.dto';
import { Music } from '../../domain/entities/music.entity';

@Injectable()
export class MusicService {
  constructor(
    private readonly createMusicUseCase: CreateMusicUseCase,
    private readonly deleteMusicUseCase: DeleteMusicUseCase,
    private readonly getMusicUseCase: GetMusicUseCase,
    private readonly updateMusicUseCase: UpdateMusicUseCase,
  ) {}

  // 🔹 File upload + DTO processing
  async create(file: Express.Multer.File, body: any): Promise<Music> {
    const createMusicDto = new CreateMusicDto();
    createMusicDto.user_create_id = Number(body.user_create_id);
    createMusicDto.category_id = Number(body.category_id);
    createMusicDto.title = body.title;

    return this.createMusicUseCase.execute(file, createMusicDto);
  }

  async findAll(): Promise<Music[]> {
    return this.getMusicUseCase.executeAll();
  }

  async findById(id: number): Promise<Music> {
    return this.getMusicUseCase.execute(id);
  }

  async update(id: number, body: any, file?: Express.Multer.File,): Promise<Music> {
     const updateMusicDto = new UpdateMusicDto();
        // updateBackgroundDto.user_create_id = Number(body.user_create_id);
        updateMusicDto.category_id = Number(body.category_id);
        updateMusicDto.title = body.title;
    
    return this.updateMusicUseCase.execute(id, updateMusicDto, file);
  }

  async delete(id: number): Promise<void> {
    return this.deleteMusicUseCase.execute(id);
  }
}
