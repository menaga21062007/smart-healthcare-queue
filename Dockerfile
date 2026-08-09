# =========================================================
# SMART HEALTHCARE QUEUE - PRODUCTION DOCKERFILE
# =========================================================

# =========================================================
# 1. FRONTEND BUILD
# =========================================================

FROM node:20-bookworm-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./
COPY shared/ ../shared/

RUN npm run build


# =========================================================
# 2. BACKEND BUILD
# =========================================================

FROM node:20-bookworm-slim AS backend-builder

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
RUN echo "========================================" && \
    echo "BACKEND DIST CONTENTS" && \
    echo "========================================" && \
    find /app/backend/dist -type f && \
    echo "========================================"


# =========================================================
# 3. PRODUCTION RUNNER
# =========================================================

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# ---------------------------------------------------------
# Backend package files
# ---------------------------------------------------------

COPY backend/package*.json ./backend/

# Install production dependencies
RUN cd backend && npm ci --omit=dev


# ---------------------------------------------------------
# Backend compiled JavaScript
# ---------------------------------------------------------

COPY --from=backend-builder \
    /app/backend/dist \
    ./backend/dist


# ---------------------------------------------------------
# Prisma generated engine/client
# ---------------------------------------------------------

COPY --from=backend-builder \
    /app/backend/node_modules/.prisma \
    ./backend/node_modules/.prisma


# ---------------------------------------------------------
# Prisma schema
# ---------------------------------------------------------

COPY --from=backend-builder \
    /app/backend/prisma \
    ./backend/prisma


# ---------------------------------------------------------
# Frontend
# ---------------------------------------------------------

COPY --from=frontend-builder \
    /app/frontend/dist \
    ./frontend/dist


# Also place frontend where the compiled server's
# existing relative path can find it.
COPY --from=frontend-builder \
    /app/frontend/dist \
    ./backend/dist/frontend/dist


# ---------------------------------------------------------
# Port
# ---------------------------------------------------------

EXPOSE 5000


# =========================================================
# START APPLICATION
# =========================================================
#
# Render provides DATABASE_URL through Environment Variables.
#
# Prisma creates/updates the PostgreSQL tables before
# starting the Express server.
#
# =========================================================

CMD ["sh", "-c", "npx --yes prisma@5.22.0 db push --skip-generate && node /app/backend/dist/backend/src/server.js"]