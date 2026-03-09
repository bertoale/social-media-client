# Stage 1: build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Stage 2: production runtime
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copy only what dibutuhkan untuk runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Jika ada folder uploads, bisa mount via volume (optional)
# COPY --from=builder /app/uploads ./uploads

EXPOSE 3000

CMD ["npx", "next", "start"]