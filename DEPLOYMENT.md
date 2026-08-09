# CareQueue AI - Production Deployment Guide

This guide covers step-by-step deployment for **CareQueue AI Smart Healthcare Queue Platform**.

---

## 🌟 Recommended Deployment Methods

### Option 1: One-Click Render.com Blueprint (Easiest & Free)

1. Push your codebase to GitHub/GitLab repository.
2. Log in to [Render.com](https://render.com).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository containing `render.yaml`.
5. Render will automatically build the frontend assets, compile the Express backend, and spin up the web service on a free SSL domain (e.g., `https://carequeue-ai-platform.onrender.com`).

---

### Option 2: Docker & Docker Compose (Self-Hosted VPS / AWS / DigitalOcean)

Ensure Docker and Docker Compose are installed on your server.

```bash
# 1. Clone repository
git clone <your-repo-url>
cd smart-healthcare-queue

# 2. Build & Launch Containers in Background
docker-compose up -d --build

# 3. Check Status
docker-compose ps
```

The application will be live on `http://<YOUR-SERVER-IP>:5000` with an active PostgreSQL database container.

---

### Option 3: Railway.app Cloud Deployment

1. Go to [Railway.app](https://railway.app) and create a new project.
2. Add a **PostgreSQL** service to Railway.
3. Deploy your GitHub repo as a Node.js web service.
4. Set environment variables in Railway:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `JWT_SECRET=your_production_secret_key`
   - `DATABASE_URL=${{ Postgres.DATABASE_URL }}`
5. Set Build Command: `cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build`
6. Set Start Command: `cd backend && npm start`

---

### Option 4: Vercel (Frontend) + Render / Railway (Backend)

#### Frontend on Vercel:
1. Connect `frontend/` directory to Vercel.
2. Framework Preset: **Vite**.
3. Environment Variable:
   - `VITE_API_URL=https://your-backend-domain.com/api`

#### Backend API on Render / Railway:
1. Connect `backend/` directory to Render / Railway.
2. Build Command: `npm install && npm run build`.
3. Start Command: `npm start`.

---

## 🔒 Production Security Checklist

- [x] Set strong `JWT_SECRET` in environment variables.
- [x] Restrict `CORS_ORIGIN` to your production domain.
- [x] Configure SSL/TLS HTTPS certificates (provided automatically by Render, Railway, Vercel, or Nginx Certbot).
- [x] PostgreSQL database migrations using Prisma (`npx prisma db push` or `npx prisma migrate deploy`).
