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
  BadRequestException,
} from '@nestjs/common';
import { RoomService } from './application/services/room.service';
import { UpdateRoomDto } from './application/dto/update-room.dto';
import { GetRoomResponse } from './application/responses/get-room.response';
import { GetAllRoomsResponse } from './application/responses/get-all-rooms.response';
import { UpdateRoomResponse } from './application/responses/update-room.response';
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

@Controller({
  path: 'rooms',
  version: '1',
})
@ApiTags('Rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Public()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Room Creation',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        privacy: { type: 'string', enum: ['public', 'private'] },
        maxMembers: { type: 'integer' },
        category: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Room successfully created.' })
  @UseInterceptors(FileInterceptor('file'))
  async createRoom(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.roomService.create(file, body);
  }

  @Public()
  @Get()
  @ApiOkResponse({
    description: 'Successfully retrieved all room records.',
    type: GetAllRoomsResponse,
  })
  async findAll() {
    return this.roomService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully retrieved the room record.',
    type: GetRoomResponse,
  })
  @ApiNotFoundResponse({ description: 'Room not found.' })
  async findOne(@Param('id') id: number) {
    return this.roomService.findById(id);
  }

  @Public()
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Room Update',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', nullable: true },
        name: { type: 'string', default: '', nullable: true },
        privacy: {
          type: 'string',
          enum: ['public', 'private'],
          default: '',
          nullable: true,
        },
        maxMembers: { type: 'integer', default: '', nullable: true },
        category: { type: 'string', default: '', nullable: true },
        status: {
          type: 'string',
          enum: ['active', 'ban', 'pending'],
          nullable: true,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    description: 'Room successfully updated.',
    type: UpdateRoomResponse,
  })
  @ApiNotFoundResponse({ description: 'Room not found.' })
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    // Filter out empty strings, null, and undefined values
    const updateRoomDto: Partial<UpdateRoomDto> = Object.fromEntries(
      Object.entries({
        name: body.name?.trim() || undefined,
        privacy: body.privacy || undefined,
        maxMembers: body.maxMembers ? Number(body.maxMembers) : undefined,
        category: body.category?.trim() || undefined,
        status: body.status || undefined,
        imageUrl: file ? `/uploads/${file.filename}` : undefined,
      }).filter(([value]) => value !== undefined),
    );

    if (Object.keys(updateRoomDto).length === 0) {
      throw new BadRequestException('No valid fields to update');
    }

    return this.roomService.update(id, updateRoomDto);
  }

  @Public()
  @Delete(':id')
  @ApiOkResponse({ description: 'Room successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Room not found.' })
  async delete(@Param('id') id: number) {
    return this.roomService.delete(id);
  }
}
