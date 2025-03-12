import { Test, TestingModule } from '@nestjs/testing';
import { BlogCommentController } from './blog-comment.controller';
import { BlogCommentService } from './blog-comment.service';

describe('BlogCommentController', () => {
  let controller: BlogCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogCommentController],
      providers: [BlogCommentService],
    }).compile();

    controller = module.get<BlogCommentController>(BlogCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
