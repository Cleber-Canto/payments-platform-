/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import type { PaymentRepository } from '../../domain/repositories/payment.repository.interface';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from '../../domain/entities/payment.entity';
import { MercadoPagoService } from '../../infrastructure/payments/mercadopago/mercadopago.service';

interface UpdateStatusDto {
  status: PaymentStatus;
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    private readonly mercadoPagoService: MercadoPagoService, // injeta o serviço do Mercado Pago
  ) {}

  /**
   * Cria um pagamento
   */
  async create(dto: any): Promise<Payment | any> {
    const payment: Payment = {
      id: uuidv4(),
      cpf: dto.cpf,
      description: dto.description,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod as PaymentMethod,
      status: PaymentStatus.PENDING,
      createdAt: new Date(),
    };

    // Caso seja cartão de crédito → integra com Mercado Pago
    if (dto.paymentMethod === PaymentMethod.CREDIT_CARD) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const preference = await this.mercadoPagoService.createPreference(payment);
      await this.paymentRepository.save(payment);
      return { ...payment, checkoutUrl: preference.init_point };
    }

    // Caso seja PIX → apenas salva no banco
    return this.paymentRepository.save(payment);
  }

  async update(id: string, dto: UpdateStatusDto): Promise<Payment> {
    return this.paymentRepository.update(id, dto.status);
  }

  async findById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  async list(filters: any): Promise<Payment[]> {
    return this.paymentRepository.list(filters);
  }

  async delete(id: string): Promise<void> {
    await this.paymentRepository.delete(id);
  }

  async updateStatus(paymentId: string, newStatus: PaymentStatus): Promise<Payment> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) throw new Error('Pagamento não encontrado');

    payment.status = newStatus;
    await this.paymentRepository.save(payment);

    return payment;
  }

  async updateStatusFromWebhook(payload: { id: string; status: PaymentStatus }): Promise<void> {
    const { id, status } = payload;

    if (!id || !status) {
      throw new Error('Payload inválido: id e status são obrigatórios');
    }

    await this.updateStatus(id, status);
  }
}
