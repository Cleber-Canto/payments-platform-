/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';

import { Payment } from '../entities/payment.entity';
import type { PaymentRepository } from './payment.repository.interface';

@Injectable()
export class PaymentRepositoryPostgres implements PaymentRepository {
  private readonly logger = new Logger(PaymentRepositoryPostgres.name);

  constructor(private readonly pool: Pool) {}

  async save(payment: Payment): Promise<Payment> {
    await this.pool.query(
      `
      INSERT INTO payments (id, cpf, description, amount, payment_method, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        payment.id,
        payment.cpf,
        payment.description,
        payment.amount,
        payment.paymentMethod,
        payment.status,
        payment.createdAt,
      ],
    );

    return payment;
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await this.pool.query(
      `SELECT * FROM payments WHERE id = $1`,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async list(): Promise<Payment[]> {
    const result = await this.pool.query(
      `SELECT * FROM payments ORDER BY created_at DESC`,
    );

    return result.rows;
  }

  async update(id: string, status: string): Promise<Payment> {
    const result = await this.pool.query(
      `
      UPDATE payments
      SET status = $2
      WHERE id = $1
      RETURNING *
      `,
      [id, status],
    );

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID é obrigatório para deletar pagamento');
    }

    this.logger.warn(`⚠️ DELETE NO BANCO | ID=${id}`);

    await this.pool.query(
      `DELETE FROM payments WHERE id = $1`,
      [id],
    );
  }
}
