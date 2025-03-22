import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './domain/project';
import { ProjectsService } from './projects.service';
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
import { IPaginationOptions } from '../utils/types/pagination-options';
import { NullableType } from '../utils/types/nullable.type';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Projects')
@Controller({
  path: 'projects',
  version: '1',
})
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiCreatedResponse({
    type: Project,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.create(createProjectDto);
  }

  @ApiOkResponse({
    type: Project,
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
  ): Promise<Project[]> {
    return this.projectsService.findAllWithPagination(paginationOptions);
  }

  @ApiOkResponse({
    type: Project,
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
  findOne(@Param('id') id: Project['id']): Promise<NullableType<Project>> {
    return this.projectsService.findById(id);
  }

  @ApiOkResponse({
    type: Project,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('room/:id')
  findByRoomId(@Param('id') id: Project['roomId']): Promise<Project[]> {
    return this.projectsService.findByRoomId(id);
  }
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
    @Param('id') id: Project['id'],
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project | null> {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Project['id']): Promise<void> {
    return this.projectsService.remove(id);
  }
}
