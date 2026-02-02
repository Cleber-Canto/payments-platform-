/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';

@Injectable()
export class MercadoPagoService {
  async createPreference(paymentData: any) {
    // Aqui vai a chamada para a API do Mercado Pago que você viu na documentação
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: paymentData.description,
            quantity: 1,
            unit_price: paymentData.amount,
            currency_id: 'BRL',
          },
        ],
        external_reference: paymentData.id,
        notification_url: `${process.env.NGROK_URL}/api/mercadopago/webhook`,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(`Erro no Mercado Pago: ${data.message}`);
    }

    return data; // Retorna o objeto que contém o init_point
  }
}
