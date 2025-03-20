import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  // Create
  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const newPackage = this.packageRepository.create(createPackageDto);
    return await this.packageRepository.save(newPackage);
  }

  // Find all
  async findAll(): Promise<Package[]> {
    return await this.packageRepository.find();
  }

  // Find one by ID
  async findOne(id: number): Promise<Package> {
    const pkg = await this.packageRepository.findOneBy({ package_id: id });
    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return pkg;
  }

  // Update (Edit)
  async update(
    id: number,
    updatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    const pkg = await this.findOne(id);
    Object.assign(pkg, updatePackageDto);
    return await this.packageRepository.save(pkg);
  }

  // Delete
  async remove(id: number): Promise<void> {
    const pkg = await this.findOne(id);
    await this.packageRepository.remove(pkg);
  }
}
