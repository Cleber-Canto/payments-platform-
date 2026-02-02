export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAIL = 'FAIL',
}

export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
}

export class Payment {
  [x: string]: any;
  constructor(
    public readonly id: string,
    public readonly cpf: string,
    public readonly description: string,
    public readonly amount: number,
    public readonly paymentMethod: PaymentMethod,
    public status: PaymentStatus = PaymentStatus.PENDING,
    public readonly createdAt: Date = new Date(),
  ) {}
}
