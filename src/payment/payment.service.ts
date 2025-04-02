import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Package } from '../package/entities/package.entity';
import PayOS from '@payos/node';
import * as crypto from 'crypto';
import { Voucher } from '../voucher/entities/voucher.entity';

@Injectable()
export class PaymentService {
  private payOS: PayOS;
  private readonly returnUrl = 'http://localhost:3000/payment/success';
  private readonly cancelUrl = 'http://localhost:3000/payment/cancel';

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
  ) {
    this.payOS = new PayOS(
      process.env.PAYOS_CLIENT_ID!,
      process.env.PAYOS_API_KEY!,
      process.env.PAYOS_CHECKSUM_KEY!,
    );
  }

  generateRandomKey(): string {
    return crypto.randomBytes(6).toString('hex');
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const { email, packageId, voucherCode } = createPaymentDto;

    const pkg = await this.packageRepository.findOneBy({
      package_id: packageId,
    });
    if (!pkg) throw new NotFoundException('Package not found');

    let finalPrice = pkg.price;

    if (voucherCode) {
      const voucher = await this.voucherRepository.findOneBy({
        code: voucherCode,
      });

      if (!voucher) {
        throw new NotFoundException('Voucher not found');
      }

      const now = new Date();
      const expiry = new Date(voucher.expiry_date);

      if (!voucher.is_active || expiry <= now) {
        throw new HttpException(
          'Voucher expired or inactive',
          HttpStatus.BAD_REQUEST,
        );
      }

      finalPrice = finalPrice * (1 - voucher.discount_percentage / 100);
    }

    const orderCode = Number(String(Date.now()).slice(-6));

    const payLinkRes = await this.payOS.createPaymentLink({
      orderCode,
      amount: Math.round(finalPrice),
      description: pkg.name,
      returnUrl: this.returnUrl,
      cancelUrl: this.cancelUrl,
    });

    const payment = this.paymentRepository.create({
      orderCode,
      email,
      status: PaymentStatus.PENDING,
    });
    await this.paymentRepository.save(payment);

    return {
      checkoutUrl: payLinkRes.checkoutUrl,
      orderCode,
    };
  }

  async webhook(data: any) {
    const verified = this.payOS.verifyPaymentWebhookData(data);

    if (verified?.desc !== 'success') {
      throw new HttpException('Payment not successful', HttpStatus.BAD_REQUEST);
    }

    const key = this.generateRandomKey();

    const payment = await this.paymentRepository.findOneBy({
      orderCode: verified.orderCode,
    });

    if (!payment) throw new NotFoundException('Order not found');

    payment.status = PaymentStatus.COMPLETED;
    payment.key = key;
    await this.paymentRepository.save(payment);

    return { message: 'Payment completed and key generated', key };
  }

  async verifyKey(orderCode: number, key: string) {
    const payment = await this.paymentRepository.findOneBy({ orderCode });
    if (!payment) throw new NotFoundException('Order not found');
    if (payment.key !== key) {
      throw new HttpException('Invalid key', HttpStatus.UNAUTHORIZED);
    }

    return { message: 'Key verified successfully' };
  }

  async cancel(orderCode: number) {
    const payment = await this.paymentRepository.findOneBy({ orderCode });
    if (!payment) throw new NotFoundException('Order not found');
    if (payment.status === PaymentStatus.COMPLETED) {
      throw new HttpException(
        'Cannot cancel completed payment',
        HttpStatus.BAD_REQUEST,
      );
    }

    payment.status = PaymentStatus.CANCELLED;
    await this.paymentRepository.save(payment);

    return { message: 'Payment cancelled successfully' };
  }

  async verifyOrder(orderCode: number) {
    const payment = await this.paymentRepository.findOneBy({ orderCode });
    if (!payment || payment.status !== PaymentStatus.COMPLETED) {
      throw new HttpException(
        'Invalid or unprocessed order',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Placeholder: nâng cấp tài khoản tại đây (gọi userService, nếu có)
    return { message: 'Order verified - user upgraded (not implemented)' };
  }

  // Optional
  findAll() {
    return this.paymentRepository.find();
  }

  findOne(id: number) {
    return this.paymentRepository.findOneBy({ id });
  }
}
