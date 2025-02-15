import { Music } from '../entities/music.entity';

export interface MusicRepository {
  create(music: Music): Promise<Music>;
  findById(id: number): Promise<Music | null>;
  findAll(): Promise<Music[]>;
  update(id: number, music: Partial<Music>): Promise<Music>;
  delete(id: number): Promise<void>;
}
