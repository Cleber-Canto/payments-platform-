
# Payments Platform API REST desenvolvida em **Node.js/NestJS** para gerenciar o ciclo de vida de cobranças financeiras, com suporte a **PIX** e **Cartão de Crédito**. Integração com **Mercado Pago** para processamento de transações com cartão, incluindo webhook para atualização automática de status. ## Funcionalidades - Criar pagamento (PIX ou Cartão) - Atualizar status de pagamento - Buscar pagamento por ID - Listar pagamentos com filtros (CPF, método) - Deletar pagamento - Receber notificações do Mercado Pago via webhook ## Tecnologias - [NestJS](https://nestjs.com/) - [PostgreSQL](https://www.postgresql.org/) - [Mercado Pago](https://www.mercadopago.com.br/) - Docker & Docker Compose - Clean Architecture + Testes com Jest
📂 O que foi desenvolvido seguindo o teste técnico
1. Endpoints REST
    • POST /api/payment → cria um pagamento (PIX ou Cartão). 
    • PUT /api/payment/{id} → atualiza status de um pagamento. 
    • GET /api/payment/{id} → busca pagamento por ID. 
    • GET /api/payment → lista pagamentos com filtros (CPF, método). 
    • DELETE /api/payment/{id} → remove pagamento. 
2. Estrutura do domínio
    • id → UUID único. 
    • cpf → CPF do cliente. 
    • description → descrição da cobrança. 
    • amount → valor da transação. 
    • paymentMethod → PIX ou CREDIT_CARD. 
    • status → PENDING, PAID, FAIL. 
3. Regras de negócio
    • PIX → apenas cria registro com status PENDING. 
    • CREDIT_CARD → integra com Mercado Pago: 
        ◦ Cria preferência de checkout (checkoutUrl). 
        ◦ Recebe callback (webhook.controller.ts) e atualiza status (PAID ou FAIL). 
4. Integrações
    • Mercado Pago → via mercadopago.service.ts. 
    • Webhook → preparado para receber notificações e atualizar status. 
    • Banco de dados → Postgres via payment-repository.postgres.ts. 
    • Mensageria opcional → RabbitMQ (producer/consumer). 
    • Orquestração opcional → Temporal.io para workflows robustos. 
5. Considerações técnicas
    • Clean Architecture (camadas: domain, application, infrastructure). 
    • Testes unitários e e2e (jest). 
    • Validações de entrada (class-validator). 
    • Observabilidade e logging (src/shared/logger). 
    • Configuração via .env. 

📂 Como rodar o projeto localmente
    1. Instalar dependências:
       npm install
    2. Rodar em dev:
       npm run start:dev
    3. Buildar e rodar em produção:
       npm run build
       npm run start:prod
    4. Testes:
       npm run test
       npm run test:e2e

📂 Como rodar com Docker
Dockerfile
Já está pronto para buildar a aplicação NestJS.
docker-compose.yml
Inclui:
    • payments-service → API rodando na porta 3008. 
    • db → Postgres rodando na porta 5432. 
Rodar:
docker-compose up --build

🚀 Fluxo de uso
    1. Criar pagamento via POST /api/payment.
        ◦ PIX → status PENDING. 
        ◦ Cartão → retorna checkoutUrl. 
    2. Abrir checkoutUrl e pagar com cartão de teste.
        ◦ Mercado Pago envia callback → /api/mercadopago/webhook. 
        ◦ API atualiza status (PAID ou FAIL). 
    3. Consultar pagamento via GET /api/payment/:id.
Perfeito, Antonio 👌
Vou listar todos os endpoints da API de pagamentos que você implementou, com exemplos de requisição e resposta. Assim você tem um guia único para testar e documentar.

📂 Endpoints da API
1. Criar pagamento
POST /api/payment
Body (PIX):
{
  "cpf": "19119119100",
  "description": "Pagamento via PIX",
  "amount": 50,
  "paymentMethod": "PIX"
}
Body (Cartão):
{
  "cpf": "23345678899",
  "description": "Pagamento Cartão",
  "amount": 299,
  "paymentMethod": "CREDIT_CARD"
}
Resposta (PIX):
{
  "id": "uuid",
  "cpf": "19119119100",
  "description": "Pagamento via PIX",
  "amount": 50,
  "paymentMethod": "PIX",
  "status": "PENDING",
  "createdAt": "2026-02-02T02:29:05.677Z",
  "checkoutUrl": null
}
Resposta (Cartão):
{
  "id": "uuid",
  "cpf": "23345678899",
  "description": "Pagamento Cartão",
  "amount": 299,
  "paymentMethod": "CREDIT_CARD",
  "status": "PENDING",
  "createdAt": "2026-02-02T02:38:20.337Z",
  "checkoutUrl": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
}

2. Atualizar pagamento
PUT /api/payment/:id
Body:
{
  "status": "APPROVED"
}
Resposta:
{
  "message": "Pagamento atualizado com sucesso",
  "id": "uuid",
  "status": "APPROVED"
}

3. Buscar pagamento por ID
GET /api/payment/:id
Resposta:
{
  "id": "uuid",
  "cpf": "23345678899",
  "description": "Pagamento Cartão",
  "amount": "299.00",
  "paymentMethod": "CREDIT_CARD",
  "status": "PENDING",
  "createdAt": "2026-02-02T02:12:12.835Z"
}

4. Listar pagamentos
GET /api/payment
Exemplo com filtros:
GET /api/payment?cpf=23345678899&paymentMethod=CREDIT_CARD
Resposta:
[
  {
    "id": "uuid",
    "cpf": "23345678899",
    "description": "Pagamento Cartão",
    "amount": "299.00",
    "paymentMethod": "CREDIT_CARD",
    "status": "APPROVED",
    "createdAt": "2026-02-02T02:30:40.702Z"
  },
  {
    "id": "uuid",
    "cpf": "19119119100",
    "description": "Pagamento via PIX",
    "amount": "50.00",
    "paymentMethod": "PIX",
    "status": "PENDING",
    "createdAt": "2026-02-02T02:29:05.677Z"
  }
]

5. Deletar pagamento
DELETE /api/payment/:id
Resposta:
{
  "message": "Pagamento deletado com sucesso",
  "id": "uuid",
  "deletedAt": "2026-02-02T00:17:12.262Z"
}

6. Webhook Mercado Pago
POST /api/mercadopago/webhook
Body (simulação):
{
  "data": {
    "external_reference": "uuid-do-pagamento",
    "status": "approved"
  }
}
Resposta:
{
  "message": "Pagamento atualizado com sucesso",
  "id": "uuid-do-pagamento",
  "status": "PAID"
}

🚀 Resumo
    • POST /api/payment → cria pagamento (PIX ou Cartão). 
    • PUT /api/payment/:id → atualiza status. 
    • GET /api/payment/:id → busca por ID. 
    • GET /api/payment → lista pagamentos. 
    • DELETE /api/payment/:id → remove pagamento. 
    • POST /api/mercadopago/webhook → recebe callback e atualiza status. 

