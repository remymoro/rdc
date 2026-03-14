FROM node:24-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rdc" npm run db:generate
EXPOSE 3000
CMD ["npx", "nx", "serve", "api"]

FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rdc" npm run db:generate
RUN npx nx build api --configuration=production

FROM node:24-alpine AS prod
WORKDIR /app
COPY --from=builder /app/dist/apps/api .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy --config prisma.config.ts && node main.js"]
