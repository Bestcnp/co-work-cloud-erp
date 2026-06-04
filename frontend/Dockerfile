# ===========================
# Stage 1: Builder (production)
# ===========================
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===========================
# Stage 2: Dev server
# ===========================
FROM node:22-alpine AS dev

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
