# ==========================================
# Stage 1: Build Frontend
# ==========================================
FROM node:20-bookworm-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
COPY shared/ ../shared/

RUN npm run build


# ==========================================
# Stage 2: Build Backend
# ==========================================
FROM node:20-bookworm-slim AS backend-builder

# Install OpenSSL for Prisma
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
COPY shared/ ../shared/

# Generate Prisma Client
RUN npx prisma@5.22.0 generate

# IMPORTANT: Build TypeScript backend
RUN npm run build


# ==========================================
# Stage 3: Production Runner
# ==========================================
FROM node:20-bookworm-slim AS runner

RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

# Backend package files
COPY backend/package*.json ./backend/

# Production dependencies
RUN cd backend && npm ci --omit=dev

# Copy compiled backend
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copy Prisma files and generated client
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

# Copy frontend production build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy shared files if required at runtime
COPY --from=backend-builder /app/shared ./shared

WORKDIR /app/backend

ENV PORT=10000

EXPOSE 10000

CMD ["node", "dist/server.js"]