import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Put,
} from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue } from './domain/issue';
import { IssuesService } from './issues.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { RolesGuard } from '../roles/roles.guard';
import { infinityPagination } from '../utils/infinity-pagination';
import { QueryIssueDto } from './dto/query-issue.dto';
import { Project } from '../projects/domain/project';
import { UpdateIssueStatusDto } from './dto/update-issue-status.dto';
@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Issues')
@Controller({
  path: 'issues',
  version: '1',
})
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @ApiCreatedResponse({
    type: Issue,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createIssueDto: CreateIssueDto): Promise<Issue> {
    return this.issuesService.create(createIssueDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Issue),
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryIssueDto,
  ): Promise<InfinityPaginationResponseDto<Issue>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.issuesService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: { page, limit },
      }),
      { page, limit },
    );
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Issue),
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('project/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findByProjectId(@Param('id') id: Project['id']): Promise<Issue[]> {
    return this.issuesService.findByProjectId(id);
  }

  @ApiOkResponse({
    type: Issue,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Put('status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  updateIssueStatus(
    @Param('id') id: Issue['id'],
    @Body() updateIssueStatusDto: UpdateIssueStatusDto,
  ): Promise<Issue> {
    return this.issuesService.updateIssueStatus(
      id,
      updateIssueStatusDto.status,
    );
  }
  @ApiOkResponse({
    type: Issue,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Issue['id']): Promise<NullableType<Issue>> {
    return this.issuesService.findById(id);
  }

  @ApiOkResponse({
    type: Issue,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Issue['id'],
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<Issue | null> {
    return this.issuesService.update(id, updateIssueDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Issue['id']): Promise<void> {
    return this.issuesService.remove(id);
  }
}
