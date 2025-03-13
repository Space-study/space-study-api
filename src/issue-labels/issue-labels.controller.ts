import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateIssueLabelDto } from './dto/create-issue-label.dto';
import { UpdateIssueLabelDto } from './dto/update-issue-label.dto';
import { IssueLabel } from './domain/issue-label';
import { IssueLabelsService } from './issue-labels.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Issue Labels')
@Controller({
  path: 'issue-labels',
  version: '1',
})
export class IssueLabelsController {
  constructor(private readonly issueLabelsService: IssueLabelsService) {}

  @ApiCreatedResponse({
    type: IssueLabel,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createIssueLabelDto: CreateIssueLabelDto,
  ): Promise<IssueLabel> {
    return this.issueLabelsService.create(createIssueLabelDto);
  }

  @ApiOkResponse({
    type: IssueLabel,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  findAllWithPagination(
    @Query() paginationOptions: IPaginationOptions,
  ): Promise<IssueLabel[]> {
    return this.issueLabelsService.findAllWithPagination(paginationOptions);
  }

  @ApiOkResponse({
    type: IssueLabel,
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
  findOne(
    @Param('id') id: IssueLabel['id'],
  ): Promise<NullableType<IssueLabel>> {
    return this.issueLabelsService.findById(id);
  }

  @ApiOkResponse({
    type: IssueLabel,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: IssueLabel['id'],
    @Body() updateIssueLabelDto: UpdateIssueLabelDto,
  ): Promise<IssueLabel | null> {
    return this.issueLabelsService.update(id, updateIssueLabelDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: IssueLabel['id']): Promise<void> {
    return this.issueLabelsService.remove(id);
  }
}
