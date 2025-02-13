// src/music/controllers/music.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MusicService } from './application/services/music.service';
import { UpdateMusicDto } from './application/dto/update-music.dto';
import { CreateMusicResponse } from './application/responses/create-music.response';
import { GetMusicResponse } from './application/responses/get-music.response';
import { GetAllMusicResponse } from './application/responses/get-all-musics.response';
import { UpdateMusicResponse } from './application/responses/update-music.response';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'music',
  version: '1',
})
@ApiTags('Music')
export class MusicController {
  constructor(
    private readonly musicService: MusicService,
  ) { }

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
  async uploadMusic(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.musicService.create(file, body);
  }

  @Get()
  @ApiOkResponse({
    description: 'Successfully retrieved all music records.',
    type: GetAllMusicResponse,
  })
  async findAll() {
    return this.musicService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully retrieved the music record.',
    type: GetMusicResponse,
  })
  @ApiNotFoundResponse({ description: 'Music not found.' })
  async findOne(@Param('id') id: number) {
    return this.musicService.findById(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Music successfully updated.',
    type: UpdateMusicResponse,
  })
  @ApiNotFoundResponse({ description: 'Music not found.' })
  async update(
    @Param('id') id: number,
    @Body() updateMusicDto: UpdateMusicDto,
  ) {
    return this.musicService.update(id, updateMusicDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Music successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Music not found.' })
  async delete(@Param('id') id: number) {
    return this.musicService.delete(id);
  }
}
