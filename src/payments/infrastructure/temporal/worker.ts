/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Worker } from '@temporalio/worker';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { PaymentActivities } from './activities';

async function run() {
  console.log('🚀 Iniciando o contexto do NestJS...');
  
  // Criamos o contexto do Nest para usar as Activities com Injeção de Dependência
  const app = await NestFactory.createApplicationContext(AppModule);
  const activities = app.get(PaymentActivities);

  console.log('✅ Contexto NestJS carregado. Conectando ao servidor Temporal...');

  try {
    const worker = await Worker.create({
      workflowsPath: require.resolve('./workflows'),
      activities: {
        // Mapeie as funções das suas activities aqui
        createPreferenceActivity: activities.createPreferenceActivity.bind(activities),
        updateStatusActivity: activities.updateStatusActivity.bind(activities),
      },
      taskQueue: 'payments-queue',
    });

    console.log('👷 Temporal Worker está ONLINE e aguardando tarefas...');
    
    // O await worker.run() é o que mantém o processo vivo
    await worker.run();
    
  } catch (err) {
    console.error('❌ Erro fatal no Worker:', err);
    process.exit(1);
  }
}

run();