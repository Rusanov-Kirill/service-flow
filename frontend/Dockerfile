FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-/api}

RUN npm run build

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/dist /dist

CMD ["sh", "-c", "while true; do sleep 1000; done"]