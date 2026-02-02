import { Injectable } from '@nestjs/common';
// eslint-disable-next-line prettier/prettier
import { ProcessPaymentUseCase, ProcessPaymentInput } from '../../domain/use-cases/process-payment.usecase';
import * as paymentRepositoryInterface from '../../domain/repositories/payment.repository.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class PaymentActivities {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    // eslint-disable-next-line prettier/prettier
    @Inject('PaymentRepository') private readonly paymentRepository: paymentRepositoryInterface.PaymentRepository,
  ) {}

  // Defina os métodos exatamente com os nomes que o Workflow espera
  async createPreferenceActivity(input: ProcessPaymentInput): Promise<any> {
    return await this.processPaymentUseCase.execute(input);
  }

  async updateStatusActivity(id: string, status: string): Promise<void> {
    await this.paymentRepository.update(id, status);
  }
}
