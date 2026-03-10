FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run db:generate
RUN npx nx build api --configuration=production

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/api .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./
EXPOSE 3000
CMD ["node", "main.js"]
