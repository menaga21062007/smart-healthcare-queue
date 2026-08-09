# ==========================================
# 1. FRONTEND BUILD
# ==========================================

FROM node:20-bookworm-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./
COPY shared/ ../shared/

RUN npm run build


# ==========================================
# 2. BACKEND BUILD
# ==========================================

FROM node:20-bookworm-slim AS backend-builder

# Prisma requires OpenSSL
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm ci

COPY backend/ ./
COPY shared/ ../shared/

# Generate Prisma client
RUN npx prisma@5.22.0 generate

# Build TypeScript
RUN npm run build

# Show generated files for debugging
RUN echo "===== BACKEND DIST CONTENTS =====" \
    && find /app/backend/dist -type f \
    && echo "===== END DIST CONTENTS ====="


# ==========================================
# 3. PRODUCTION RUNNER
# ==========================================

FROM node:20-bookworm-slim AS runner

# Prisma runtime requires OpenSSL
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Backend package files
COPY backend/package*.json ./backend/

# Install production dependencies
RUN cd backend && npm ci --omit=dev

# Copy compiled backend
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copy Prisma schema
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

# Copy generated Prisma engine
COPY --from=backend-builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

# Initialize/update database and start server
CMD ["sh", "-c", "cd /app/backend && npx prisma@5.22.0 db push && node /app/backend/dist/backend/src/server.js"]