# ---------- STAGE 1: build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia o resto do código
COPY . .

# Build do NestJS
RUN npm run build

# ---------- STAGE 2: runtime ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copia apenas o necessário do build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Porta padrão NestJS
EXPOSE 3008

# Start da aplicação
CMD ["node", "dist/main.js"]
