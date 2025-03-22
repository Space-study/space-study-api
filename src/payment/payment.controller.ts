import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Public } from '../auth/decorators/public.decorator';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post('create')
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Public()
  @Post('webhook')
  webhook(@Req() req) {
    return this.paymentService.webhook(req.body);
  }

  @Public()
  @Post('verify-key')
  verifyKey(@Body() body: VerifyPaymentDto) {
    return this.paymentService.verifyKey(body.orderCode, body.key);
  }

  @Public()
  @Post('cancel')
  cancel(@Body() body: { orderCode: number }) {
    return this.paymentService.cancel(body.orderCode);
  }

  @Public()
  @Post('verify-order')
  verifyOrder(@Body() body: { orderCode: number }) {
    return this.paymentService.verifyOrder(body.orderCode);
  }

  @Public()
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }
}
