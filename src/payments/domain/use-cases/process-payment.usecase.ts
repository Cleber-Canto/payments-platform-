/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject } from '@nestjs/common';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../entities/payment.entity';
import type { PaymentRepository } from '../repositories/payment.repository.interface';
import { MercadoPagoService } from '../../infrastructure/payments/mercadopago/mercadopago.service';
import { v4 as uuid } from 'uuid';

export interface ProcessPaymentInput {
  cpf: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  async execute(input: ProcessPaymentInput): Promise<Payment> {
    const payment = new Payment(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
      uuid(),
      input.cpf,
      input.description,
      input.amount,
      input.paymentMethod,
      PaymentStatus.PENDING,
    );

    await this.paymentRepository.save(payment);

    if (payment.paymentMethod === PaymentMethod.CREDIT_CARD) {
      try {
        const preference = (await this.mercadoPagoService.createPreference(
          payment,
        )) as { id: string };

        console.log(`[MercadoPago] Preferência criada: ${preference.id}`);
      } catch (error) {
        payment.status = PaymentStatus.FAIL;
        await this.paymentRepository.save(payment);
        throw new Error('Falha ao integrar com provedor de pagamento externo.');
      }
    }

    return payment;
  }
}
