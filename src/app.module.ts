/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payments/infrastructure/http/payments.module';

@Module({
  imports: [
    // Para carregar o MP_ACCESS_TOKEN do arquivo .env
    ConfigModule.forRoot({
      // eslint-disable-next-line prettier/prettier
      isGlobal: true, 
    }),
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}