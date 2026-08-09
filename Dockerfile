# Frontend build
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
COPY shared/ ../shared/

RUN npm run build


# Backend build
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
COPY shared/ ../shared/

RUN npx prisma generate
RUN npm run build


# Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY backend/package*.json ./backend/

RUN cd backend && npm ci --omit=dev

COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

CMD ["node", "/app/backend/dist/server.js"]
