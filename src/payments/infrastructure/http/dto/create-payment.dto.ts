/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsPositive, Length } from 'class-validator';
import { PaymentMethod } from '../../../domain/entities/payment.entity';

export class CreatePaymentDto {
  @IsString()
  @Length(11, 11, { message: 'CPF deve ter 11 dígitos' })
  cpf: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}