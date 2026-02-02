import { Payment } from '../entities/payment.entity';

export interface PaymentRepository {
  [x: string]: any;
  save(payment: Payment): Promise<Payment>;
  update(id: string, status: string): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  list(filters: any): Promise<Payment[]>;
  delete(id: string): Promise<void>;
}
