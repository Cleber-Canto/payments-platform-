/* eslint-disable prettier/prettier */
export interface PaymentData {
  id: string;
  cpf: string;
  description: string;
  amount: number;
  paymentMethod: 'PIX' | 'CREDIT_CARD';
}

export interface MercadoPagoWebhookBody {
  action: string;
  external_reference: string; // O ID que enviamos
  data: {
    id: string; // ID interno do MP
  };
  status?: string; // Depende da versão da API
// eslint-disable-next-line prettier/prettier
}