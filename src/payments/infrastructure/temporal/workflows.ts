/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/payments/infrastructure/temporal/workflows.ts
import { proxyActivities, defineSignal, condition, setHandler } from '@temporalio/workflow';
// MUITO IMPORTANTE: Use o "import type" aqui
import type { PaymentActivities } from './activities'; 

// O Proxy só precisa do tipo para saber quais métodos existem
const { createPreferenceActivity, updateStatusActivity } = proxyActivities<PaymentActivities>({
  startToCloseTimeout: '1 minute',
  retry: {
    // eslint-disable-next-line prettier/prettier
    maximumAttempts: 3,
  },
});

// eslint-disable-next-line prettier/prettier
export const paymentStatusSignal = defineSignal<[string]>('paymentStatusSignal');

export async function paymentWorkflow(payment: any): Promise<void> {
  let finalStatus = '';

  // Configura o handler para receber o sinal do Webhook
  setHandler(paymentStatusSignal, (status: string) => {
    finalStatus = status;
  });

  // 1. Registra e cria preferência no Mercado Pago
  await createPreferenceActivity(payment);

  if (payment.paymentMethod === 'CREDIT_CARD') {
    // 2. Aguarda o sinal do Webhook (destrava quando finalStatus mudar)
    // O Temporal gerencia essa espera de forma durável
    await condition(() => finalStatus !== '', '24 hours');

    // 3. Atualiza o status final no banco de dados
    await updateStatusActivity(payment.id, finalStatus);
  }
}