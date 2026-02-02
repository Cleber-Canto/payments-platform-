/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { PaymentService } from '../../../application/services/payment.service';
import { PaymentStatus } from '../../../domain/entities/payment.entity';

interface WebhookPayload {
  data: {
    external_reference: string;
    status: string;
  };
}

@Controller('api/mercadopago')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: WebhookPayload) {
    try {
      const { external_reference, status } = body.data || {};

      this.logger.log(`➡️ WEBHOOK RECEBIDO | REF=${external_reference} | STATUS=${status}`);

      if (!external_reference || !status) {
        return { message: 'Webhook recebido, mas dados incompletos' };
      }

      let newStatus: PaymentStatus = PaymentStatus.PENDING;
      switch (status) {
        case 'approved':
          newStatus = PaymentStatus.PAID;
          break;
        case 'rejected':
          newStatus = PaymentStatus.FAIL;
          break;
        case 'pending':
          newStatus = PaymentStatus.PENDING;
          break;
      }

      await this.paymentService.updateStatus(external_reference, newStatus);

      this.logger.log(`✅ PAGAMENTO ATUALIZADO | REF=${external_reference} | NOVO STATUS=${newStatus}`);

      return {
        message: `Pagamento atualizado com sucesso`,
        id: external_reference,
        status: newStatus,
      };
    } catch (error) {
      this.logger.error(`❌ ERRO WEBHOOK | ${error.message}`);
      return { message: 'Erro ao processar webhook', error: error.message };
    }
  }
}
