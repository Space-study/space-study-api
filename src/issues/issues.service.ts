import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { IssueRepository } from './infrastructure/persistence/issue.repository';
import { Issue } from './domain/issue';
import { IssueStatus } from './infrastructure/enum/issue-status.enum';
import { UserRepository } from '../users/infrastructure/persistence/user.repository';
import { ProjectRepository } from '../projects/infrastructure/persistence/project.repository';
import { IssueLabelRepository } from '../issue-labels/infrastructure/persistence/issue-label.repository';

interface FindManyWithPaginationParams {
  filterOptions?: Record<string, any> | null;
  sortOptions?: Array<Record<string, any>> | null;
  paginationOptions: IPaginationOptions;
}

@Injectable()
export class IssuesService {
  constructor(
    private readonly issueRepository: IssueRepository,
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly issueLabelRepository: IssueLabelRepository,
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    // Validate and retrieve reporter
    let reporter: Issue['reporter'] | undefined | null = undefined;
    if (createIssueDto.reporterId) {
      reporter = await this.userRepository.findById(createIssueDto.reporterId);
      if (!reporter) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { reporterId: 'reporterNotFound' },
        });
      }
    }

    // Validate and retrieve assignee
    let assignee: Issue['assignee'] | undefined | null = undefined;
    if (createIssueDto.assigneeId) {
      assignee = await this.userRepository.findById(createIssueDto.assigneeId);
      if (!assignee) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { assigneeId: 'assigneeNotFound' },
        });
      }
    }

    // Validate and retrieve project
    let project: Issue['project'] | undefined | null = undefined;
    if (createIssueDto.projectId) {
      project = await this.projectRepository.findById(createIssueDto.projectId);
      if (!project) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { projectId: 'projectNotFound' },
        });
      }
    }

    // Validate and retrieve participants
    let participants: Issue['participants'] | undefined | null = undefined;
    if (
      createIssueDto.participantIds &&
      createIssueDto.participantIds.length > 0
    ) {
      participants = await this.userRepository.findByIds(
        createIssueDto.participantIds,
      );
      if (participants.length !== createIssueDto.participantIds.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { participantIds: 'oneOrMoreParticipantsNotFound' },
        });
      }
    }

    // Validate and retrieve labels
    let labels: Issue['labels'] | undefined | null = undefined;
    if (createIssueDto.labelIds && createIssueDto.labelIds.length > 0) {
      labels = await this.issueLabelRepository.findByIds(
        createIssueDto.labelIds,
      );
      if (labels.length !== createIssueDto.labelIds.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { labelIds: 'oneOrMoreLabelsNotFound' },
        });
      }
    }

    // Build the new Issue payload
    const newIssue: Partial<Issue> = {
      title: createIssueDto.title,
      description: createIssueDto.description,
      status: createIssueDto.status ?? IssueStatus.OPEN,
      timeEstimate: createIssueDto.timeEstimate ?? 0,
      timeSpent: createIssueDto.timeSpent ?? 0,
      reporter,
      assignee,
      project,
      participants,
      labels,
    };

    // Create the issue via the repository
    return this.issueRepository.create(newIssue as Issue);
  }

  async findManyWithPagination({
    paginationOptions,
  }: FindManyWithPaginationParams): Promise<Issue[]> {
    return this.issueRepository.findAllWithPagination({
      paginationOptions,
    });
  }

  findById(id: Issue['id']): Promise<NullableType<Issue>> {
    return this.issueRepository.findById(id);
  }

  findByIds(ids: Issue['id'][]): Promise<Issue[]> {
    return this.issueRepository.findByIds(ids);
  }

  async update(
    id: Issue['id'],
    updateIssueDto: UpdateIssueDto,
  ): Promise<Issue | null> {
    // Validate and update reporter if provided
    let reporter: Issue['reporter'] | undefined | null = undefined;
    if (updateIssueDto.reporterId !== undefined) {
      if (updateIssueDto.reporterId !== null) {
        reporter = await this.userRepository.findById(
          updateIssueDto.reporterId,
        );
        if (!reporter) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { reporterId: 'reporterNotFound' },
          });
        }
      } else {
        reporter = null;
      }
    }

    // Validate and update assignee if provided
    let assignee: Issue['assignee'] | undefined | null = undefined;
    if (updateIssueDto.assigneeId !== undefined) {
      if (updateIssueDto.assigneeId !== null) {
        assignee = await this.userRepository.findById(
          updateIssueDto.assigneeId,
        );
        if (!assignee) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { assigneeId: 'assigneeNotFound' },
          });
        }
      } else {
        assignee = null;
      }
    }

    // Validate and update project if provided
    let project: Issue['project'] | undefined | null = undefined;
    if (updateIssueDto.projectId !== undefined) {
      if (updateIssueDto.projectId !== null) {
        project = await this.projectRepository.findById(
          updateIssueDto.projectId,
        );
        if (!project) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { projectId: 'projectNotFound' },
          });
        }
      } else {
        project = null;
      }
    }

    // Validate and update participants if provided
    let participants: Issue['participants'] | undefined = undefined;
    if (updateIssueDto.participantIds !== undefined) {
      if (updateIssueDto.participantIds !== null) {
        participants = await this.userRepository.findByIds(
          updateIssueDto.participantIds,
        );
        if (participants.length !== updateIssueDto.participantIds.length) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { participantIds: 'oneOrMoreParticipantsNotFound' },
          });
        }
      } else {
        participants = [];
      }
    }

    // Validate and update labels if provided
    let labels: Issue['labels'] | undefined = undefined;
    if (updateIssueDto.labelIds !== undefined) {
      if (updateIssueDto.labelIds !== null) {
        labels = await this.issueLabelRepository.findByIds(
          updateIssueDto.labelIds,
        );
        if (labels.length !== updateIssueDto.labelIds.length) {
          throw new UnprocessableEntityException({
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: { labelIds: 'oneOrMoreLabelsNotFound' },
          });
        }
      } else {
        labels = [];
      }
    }

    // Build the update payload merging new values and existing ones
    const updatePayload: Partial<Issue> = {
      ...(updateIssueDto.title !== undefined && {
        title: updateIssueDto.title,
      }),
      ...(updateIssueDto.description !== undefined && {
        description: updateIssueDto.description,
      }),
      ...(updateIssueDto.status !== undefined && {
        status: updateIssueDto.status,
      }),
      ...(updateIssueDto.timeEstimate !== undefined && {
        timeEstimate: updateIssueDto.timeEstimate,
      }),
      ...(updateIssueDto.timeSpent !== undefined && {
        timeSpent: updateIssueDto.timeSpent,
      }),
      ...(reporter !== undefined && { reporter }),
      ...(assignee !== undefined && { assignee }),
      ...(project !== undefined && { project }),
      ...(participants !== undefined && { participants }),
      ...(labels !== undefined && { labels }),
    };

    const updated = await this.issueRepository.update(id, updatePayload);
    if (updated) {
      return this.issueRepository.findById(id);
    }
    return null;
  }

  async remove(id: Issue['id']): Promise<void> {
    await this.issueRepository.remove(id);
  }
}
