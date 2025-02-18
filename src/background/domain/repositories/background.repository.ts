import { Background } from '../entities/background.entity';

export interface BackgroundRepository {
  create(background: Background): Promise<Background>;
  findById(background_id: number): Promise<Background | null>;
  findAll(): Promise<Background[]>;
  update(id: number, background: Partial<Background>): Promise<Background>;
  delete(background_id: number): Promise<void>;
}
