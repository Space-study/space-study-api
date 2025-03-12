import { Repository } from 'typeorm';
import { BackgroundRepository } from '../../domain/repositories/background.repository';
import { Background } from '../../domain/entities/background.entity';
import { BackgroundOrmEntity } from '../persistence/background-orm.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BackgroundRepositoryImpl implements BackgroundRepository {
  constructor(
    @InjectRepository(BackgroundOrmEntity)
    private readonly repository: Repository<BackgroundOrmEntity>,
  ) {}
  async findAll(): Promise<Background[]> {
    return await this.repository.find();
  }

  async create(background: Background): Promise<Background> {
    return await this.repository.save(background);
  }

  async findById(background_id: number): Promise<Background | null> {
    return await this.repository.findOne({ where: { background_id } });
  }

  async update(
    id: number,
    background: Partial<Background>,
  ): Promise<Background> {
    await this.repository.update(id, background);
    const updatedBackground = await this.findById(id);
    if (!updatedBackground) {
      throw new Error('Backgound not found');
    }
    return updatedBackground;
  }

  async delete(background_id: number): Promise<void> {
    await this.repository.delete(background_id);
  }
}
