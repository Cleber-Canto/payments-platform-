/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { Pool } from 'pg';

import { PaymentController } from './payment.controller';
import { PaymentService } from '../../application/services/payment.service';
import { MercadoPagoService } from '../payments/mercadopago/mercadopago.service';
import { PaymentActivities } from '../temporal/activities';
import { ProcessPaymentUseCase } from '../../domain/use-cases/process-payment.usecase';
import { PaymentRepositoryPostgres } from '../../domain/repositories/payment-repository.postgres';

@Module({
  controllers: [PaymentController],
  providers: [
    // 🔌 Postgres (RODANDO LOCAL + DB NO DOCKER)
    {
      provide: Pool,
      useValue: new Pool({
        host: 'localhost',
        port: 5435,
        user: 'postgres',
        password: 'postgres',
        database: 'payments',
      }),
    },

    PaymentService,
    MercadoPagoService,
    ProcessPaymentUseCase,
    PaymentActivities,

    // 🔁 Repositório usando Postgres
    {
      provide: 'PaymentRepository',
      useClass: PaymentRepositoryPostgres,
    },
  ],
})
export class PaymentsModule {}
