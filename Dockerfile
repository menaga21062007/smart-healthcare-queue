# ==========================================
# 1. Frontend Build Stage
# ==========================================

FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
COPY shared/ ../shared/

RUN npm run build


# ==========================================
# 2. Backend Build Stage
# ==========================================

FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
COPY shared/ ../shared/

RUN npx prisma generate

RUN npm run build

# Show exactly what TypeScript generated
RUN echo "===== BACKEND DIST CONTENTS =====" && \
    find /app/backend/dist -type f && \
    echo "===== END DIST CONTENTS ====="


# ==========================================
# 3. Production Stage
# ==========================================

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies
COPY backend/package*.json ./backend/

RUN cd backend && npm ci --omit=dev

# Copy compiled backend
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copy Prisma
COPY --from=backend-builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

# Copy frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

# Start backend
CMD ["node","/app/backend/dist/backend/src/server.js"]
