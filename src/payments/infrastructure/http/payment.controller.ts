/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  Delete,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { PaymentService } from '../../application/services/payment.service';

@Controller('payment') // prefixo global /api
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * POST /api/payment
   */
  @Post()
  async create(@Body() createPaymentDto: any) {
    this.logger.log(
      `➡️ CREATE PAYMENT | REQUEST = ${JSON.stringify(createPaymentDto)}`,
    );

    const payment = await this.paymentService.create(createPaymentDto);

    this.logger.log(
      `✅ PAYMENT CREATED | ID=${payment.id} | STATUS=${payment.status}`,
    );

    // 🔑 Ajuste: incluir checkoutUrl se vier do service (caso cartão de crédito)
    return {
      id: payment.id,
      cpf: payment.cpf,
      description: payment.description,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      createdAt: payment.createdAt,
      checkoutUrl: payment.checkoutUrl ?? null,
    };
  }

  /**
   * GET /api/payment/:id
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    this.logger.log(`🔍 FIND PAYMENT | ID=${id}`);
    return this.paymentService.findById(id);
  }

  /**
   * GET /api/payment
   */
  @Get()
  async list(@Query() filters: any) {
    this.logger.log(`📄 LIST PAYMENTS | FILTERS=${JSON.stringify(filters)}`);
    return this.paymentService.list(filters);
  }

  /**
   * PUT /api/payment/:id
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    this.logger.log(
      `✏️ UPDATE PAYMENT | ID=${id} | DATA=${JSON.stringify(updateDto)}`,
    );
    return this.paymentService.update(id, updateDto);
  }

  /**
   * DELETE /api/payment/:id
   */
  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: string) {
    this.logger.log(`🗑️ DELETE PAYMENT | ID=${id}`);

    await this.paymentService.delete(id);

    return {
      message: 'Pagamento deletado com sucesso',
      id,
      deletedAt: new Date(),
    };
  }
}
