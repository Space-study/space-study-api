import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { MusicService } from './application/services/music.service';
import { GetMusicResponse } from './application/responses/get-music.response';
import { GetAllMusicResponse } from './application/responses/get-all-musics.response';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorators/public.decorator';
import { Music } from './domain/entities/music.entity';

@Controller({
  path: 'music',
  version: '1',
})
@ApiTags('Music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

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
      },
    },
  })
  @ApiCreatedResponse({ description: 'Music successfully created.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadMusic(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.musicService.create(file, body);
  }

  @Public()
  @Get()
  @ApiOkResponse({
    description: 'Successfully retrieved all music records.',
    type: GetAllMusicResponse,
  })
  async findAll() {
    return this.musicService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully retrieved the music record.',
    type: GetMusicResponse,
  })
  @ApiNotFoundResponse({ description: 'Music not found.' })
  async findOne(@Param('id') id: number) {
    return this.musicService.findById(id);
  }

  @Public()
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
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
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Music not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<Music> {
    return this.musicService.update(id, body, file);
  }

  @Public()
  @Delete(':id')
  @ApiOkResponse({ description: 'Music successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Music not found.' })
  async delete(@Param('id') id: number) {
    return this.musicService.delete(id);
  }
}
