import { Injectable } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue } from './entities/issue.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
    private useService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    try {
      const issue = this.issueRepository.create(createIssueDto);
      this.mailerService
        .sendMail({
          to: 'thichanpho13@gmail.com',
          subject: 'Feeb back from user',
          template: 'report-issue.hbs',
          context: {
            title: createIssueDto.reason_title,
            description: createIssueDto.reason_description,
          },
        })
        .then(() => {})
        .catch(() => {});
      return await this.issueRepository.save(issue);
    } catch (error) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }
  }

  async findAll(): Promise<any[]> {
    const issues = await this.issueRepository.find();
    const issuesWithUserDetails = await Promise.all(
      issues.map(async (issue) => {
        const user = await this.useService.findById(issue?.reporter_id);
        return {
          ...issue,
          firstname: user?.firstName,
          lastname: user?.lastName,
        };
      }),
    );
    return issuesWithUserDetails;
  }

  async findOne(id: number): Promise<any> {
    const issue = await this.issueRepository.findOne({
      where: { report_id: id },
    });
    if (!issue) {
      return null;
    }
    const user = await this.useService.findById(issue?.reporter_id);
    return {
      ...issue,
      firstname: user?.firstName,
      lastname: user?.lastName,
    };
  }

  update(id: number, updateIssueDto: UpdateIssueDto) {
    return `This action updates a #${id} issue`;
  }

  remove(id: number) {
    return `This action removes a #${id} issue`;
  }
}
