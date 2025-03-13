import { Injectable } from '@nestjs/common';
import { CreateIssueLabelDto } from './dto/create-issue-label.dto';
import { UpdateIssueLabelDto } from './dto/update-issue-label.dto';
import { IssueLabelRepository } from './infrastructure/persistence/issue-label.repository';
import { IssueLabel } from './domain/issue-label';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
@Injectable()
export class IssueLabelsService {
  constructor(private readonly issueLabelRepository: IssueLabelRepository) {}

  async create(createIssueLabelDto: CreateIssueLabelDto): Promise<IssueLabel> {
    return this.issueLabelRepository.create({
      name: createIssueLabelDto.name,
      description: createIssueLabelDto.description,
    } as IssueLabel);
  }

  async findAllWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<IssueLabel[]> {
    return this.issueLabelRepository.findAllWithPagination({
      paginationOptions,
    });
  }

  findById(id: IssueLabel['id']): Promise<NullableType<IssueLabel>> {
    return this.issueLabelRepository.findById(id);
  }

  async update(
    id: IssueLabel['id'],
    updateIssueLabelDto: UpdateIssueLabelDto,
  ): Promise<IssueLabel | null> {
    const updated = await this.issueLabelRepository.update(
      id,
      updateIssueLabelDto as Partial<IssueLabel>,
    );
    if (updated) {
      return await this.issueLabelRepository.findById(id);
    }
    return null;
  }

  async remove(id: IssueLabel['id']): Promise<void> {
    await this.issueLabelRepository.remove(id);
  }
}
