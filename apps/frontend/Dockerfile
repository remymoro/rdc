FROM node:24-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4200
CMD ["npx", "nx", "serve", "frontend", "--host", "0.0.0.0", "--poll", "2000", "--proxy-config", "apps/frontend/proxy.conf.docker.json"]

FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nx build frontend --configuration=production

FROM nginx:alpine AS prod
COPY --from=builder /app/dist/apps/frontend/browser /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
