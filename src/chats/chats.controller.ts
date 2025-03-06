import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Chat } from './domain/chat';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllChatsDto } from './dto/find-all-chats.dto';

@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'chats',
  version: '1',
})
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiCreatedResponse({
    type: Chat,
    description: 'Chat created successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
  })
  @ApiUnprocessableEntityResponse({
    description: 'User not found',
  })
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Chat),
    description: 'Get paginated list of chats',
  })
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
  async findAll(
    @Query() query: FindAllChatsDto,
  ): Promise<InfinityPaginationResponseDto<Chat>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.chatsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Chat,
  })
  findById(@Param('id') id: string) {
    return this.chatsService.findById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Chat,
  })
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(id, updateChatDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'Chat deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }

  @ApiOperation({ summary: 'Get all messages for a chat' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all messages for a chat',
  })
  @Get(':id/messages')
  async getChatMessages(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const messages = await this.chatsService.getChatMessages({
      chatId: id,
      paginationOptions: {
        page,
        limit,
      },
    });

    return messages;
  }
}
