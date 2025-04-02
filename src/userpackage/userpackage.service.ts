import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Userpackage } from './entities/userpackage.entity';
import { CreateUserpackageDto } from './dto/create-userpackage.dto';

@Injectable()
export class UserpackageService {
  constructor(
    @InjectRepository(Userpackage)
    private readonly userpackageRepository: Repository<Userpackage>,
  ) {}
  async create(createUserpackageDto: CreateUserpackageDto) {
    const user_id = Number(createUserpackageDto.user_id);
    const package_id = Number(createUserpackageDto.package_id);
  
    if (!user_id || !package_id) {
      throw new Error('Missing user_id or package_id');
    }
  
    const newEntry = this.userpackageRepository.create({
      user_id,
      package_id,
    });
  
    const saved = await this.userpackageRepository.save(newEntry);
    return { message: 'Userpackage added', data: saved };
  }
  

  findAll() {
    return this.userpackageRepository.find();
  }

  findOne(id: number) {
    return this.userpackageRepository.findOneBy({ id });
  }

  update(id: number, updateUserpackageDto: any) {
    return this.userpackageRepository.update(id, updateUserpackageDto);
  }

  remove(id: number) {
    return this.userpackageRepository.delete(id);
  }
}
