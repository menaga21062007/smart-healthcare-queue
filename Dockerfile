# ==========================================
# 1. Frontend Build Stage
# ==========================================

FROM node:20-bookworm-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
COPY shared/ ../shared/

RUN npm run build


# ==========================================
# 2. Backend Build Stage
# ==========================================

FROM node:20-bookworm-slim AS backend-builder

WORKDIR /app/backend

# Prisma requires OpenSSL
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
COPY shared/ ../shared/

RUN npx prisma generate

RUN npm run build

RUN echo "===== BACKEND DIST CONTENTS =====" \
    && find /app/backend/dist -type f \
    && echo "===== END DIST CONTENTS ====="


# ==========================================
# 3. Production Stage
# ==========================================

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Backend package files
COPY backend/package*.json ./backend/

# Production dependencies
RUN cd backend && npm ci --omit=dev

# Compiled backend
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Prisma
COPY --from=backend-builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

# Frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

CMD ["node", "/app/backend/dist/backend/src/server.js"]