import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Package } from '../package/entities/package.entity';
import { Voucher } from '../voucher/entities/voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Package, Voucher])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
