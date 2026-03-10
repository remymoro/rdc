FROM node:24-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
RUN npm ci

# Copier tout le monorepo
COPY . .

EXPOSE 3000

CMD ["npx", "nx", "serve", "api", "--host=0.0.0.0"]
