FROM node:24-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm ci

# Copier tout le monorepo
COPY . .

EXPOSE 4200

CMD ["npx", "nx", "serve", "frontend", "--host=0.0.0.0", "--port=4200"]
