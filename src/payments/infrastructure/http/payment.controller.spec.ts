import { Controller, Post, Put, Get, Param, Body, Query } from '@nestjs/common';
import { PaymentService } from '../../application/services/payment.service';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() dto: any) {
    return this.paymentService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.paymentService.update(id, dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.paymentService.findById(id);
  }

  @Get()
  list(@Query() filters: any) {
    return this.paymentService.list(filters);
  }
}
