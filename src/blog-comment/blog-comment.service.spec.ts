import { Test, TestingModule } from '@nestjs/testing';
import { BlogCommentService } from './blog-comment.service';

describe('BlogCommentService', () => {
  let service: BlogCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogCommentService],
    }).compile();

    service = module.get<BlogCommentService>(BlogCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
