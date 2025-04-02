import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepo: Repository<Voucher>,
  ) {}

  async create(createVoucherDto: CreateVoucherDto): Promise<Voucher> {
    const voucher = this.voucherRepo.create(createVoucherDto);
    return await this.voucherRepo.save(voucher);
  }

  async findAll(): Promise<Voucher[]> {
    return await this.voucherRepo.find();
  }

  async findOne(id: number): Promise<Voucher> {
    const voucher = await this.voucherRepo.findOneBy({ voucher_id: id });
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async update(id: number, dto: UpdateVoucherDto): Promise<Voucher> {
    const voucher = await this.findOne(id);
    Object.assign(voucher, dto);
    if (!voucher) throw new NotFoundException('Voucher not found');
    return await this.voucherRepo.save(voucher);
  }

  async remove(id: number): Promise<void> {
    const voucher = await this.findOne(id);
    await this.voucherRepo.remove(voucher);
  }
}
