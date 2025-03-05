import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { BackgroundService } from './application/services/background.service';
import { UpdateBackgroundDto } from './application/dto/update-background.dto';
import { GetBackgroundResponse } from './application/responses/get-background.response';
import { GetAllBackgroundsResponse } from './application/responses/get-all-backgrounds.response';
import { UpdateBackgroundResponse } from './application/responses/update-background.response';
import { Public } from '../auth/decorators/public.decorator';

@Controller({
  path: 'backgrounds',
  version: '1',
})
@ApiTags('Backgrounds')
export class BackgroundController {
  constructor(private readonly backgroundService: BackgroundService) {}

  @Public()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Music Upload',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        user_create_id: { type: 'integer' },
        category_id: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Music successfully created.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadMusic(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.backgroundService.create(file, body);
  }

  @Public()
  @Get()
  @ApiOkResponse({
    description: 'Successfully retrieved all backgrounds.',
    type: GetAllBackgroundsResponse,
  })
  async findAll() {
    return this.backgroundService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully retrieved the background record.',
    type: GetBackgroundResponse,
  })
  @ApiNotFoundResponse({ description: 'Background not found.' })
  async findOne(@Param('id') id: number) {
    return this.backgroundService.findById(id);
  }

  @Public()
  @Patch(':id')
  @ApiOkResponse({
    description: 'Background successfully updated.',
    type: UpdateBackgroundResponse,
  })
  @ApiNotFoundResponse({ description: 'Background not found.' })
  async update(
    @Param('id') id: number,
    @Body() updateBackgroundDto: UpdateBackgroundDto,
  ) {
    return this.backgroundService.update(id, updateBackgroundDto);
  }

  @Public()
  @Delete(':id')
  @ApiOkResponse({ description: 'Background successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Background not found.' })
  async delete(@Param('id') id: number) {
    return this.backgroundService.delete(id);
  }
}
