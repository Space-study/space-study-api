import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicRepository } from '../../domain/repositories/music.repository';
import { Music } from '../../domain/entities/music.entity';
import { MusicOrmEntity } from '../persistence/music-orm.entity';

@Injectable()
export class MusicRepositoryImpl implements MusicRepository {
  constructor(
    @InjectRepository(MusicOrmEntity)
    private readonly repo: Repository<MusicOrmEntity>,
  ) {}

  async create(music: Music): Promise<Music> {
    const saved = await this.repo.save(music);
    return new Music(
      saved.music_id,
      saved.user_create_id,
      saved.category_id,
      saved.path,
      saved.title,
      saved.created_at,
    );
  }

  async findById(id: number): Promise<Music | null> {
    const music = await this.repo.findOne({ where: { music_id: id } });
    if (!music) return null;
    return new Music(
      music.music_id,
      music.user_create_id,
      music.category_id,
      music.path,
      music.title,
      music.created_at,
    );
  }

  async findAll(): Promise<Music[]> {
    const musics = await this.repo.find();
    return musics.map(
      (music) =>
        new Music(
          music.music_id,
          music.user_create_id,
          music.category_id,
          music.path,
          music.title,
          music.created_at,
        ),
    );
  }

  async update(id: number, music: Partial<Music>): Promise<Music> {
    await this.repo.update(id, music);
    const updatedMusic = await this.findById(id);
    if (!updatedMusic) {
      throw new Error('Music not found');
    }
    return updatedMusic;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
