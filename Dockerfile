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
# Stage 2: Build Backend & Generate Prisma
# ==========================================
FROM node:20-bookworm-slim AS backend-builder
WORKDIR /app/backend

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
COPY shared/ ../shared/

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma@5.22.0 generate

# Build backend if using TypeScript compilation
RUN if [ -f "tsconfig.json" ]; then npm run build; fi

# Stage 3: Production Runner Image
FROM node:20-bookworm-slim AS runner
WORKDIR /app/backend

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=backend-builder /app/backend ./
COPY --from=backend-builder /app/shared ../shared

# 💡 Explicitly copy frontend build into /app/backend/frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
EXPOSE 10000

CMD ["npm", "start"]