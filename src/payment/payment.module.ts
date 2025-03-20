import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Package } from '../package/entities/package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Package])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}


