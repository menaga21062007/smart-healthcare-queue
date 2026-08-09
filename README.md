# CareQueue AI - Smart Healthcare Queue & Room Allocation Platform

A complete, production-ready hospital queue management, appointment triage, and room-allocation system featuring real-time WebSockets, Web Speech API voice announcements, interactive visual floor map navigation, QR code check-in, and 4 role-based dashboards.

---

## 🚀 Live System Architecture

```
smart-healthcare-queue/
├── backend/                  # Node.js + Express (TypeScript) + Socket.IO + Prisma
│   ├── src/
│   │   ├── controllers/      # Auth, Queue, Room, Analytics controllers
│   │   ├── services/         # QueueEngine, Symptom Triage, AI Wait Predictor, NotificationService
│   │   ├── sockets/          # Real-time WebSocket dispatches
│   │   └── server.ts         # Express server & Socket.IO initialization (Port 5000)
│   ├── prisma/
│   │   ├── schema.prisma     # Relational database schema
│   │   └── seed.ts           # Seeding script for rooms, doctors, and demo queues
├── frontend/                 # React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
│   ├── src/
│   │   ├── components/       # FloorMap, VoicePlayer, QRScannerModal, Navbar, BookingModal
│   │   ├── context/          # AuthContext, ThemeContext, SocketContext, LanguageContext
│   │   ├── pages/            # LandingPage, PatientDashboard, ReceptionistDashboard, DoctorDashboard, AdminDashboard
│   │   └── App.tsx           # Router & theme container (Port 5173)
└── shared/                   # Domain interfaces, Enums, Socket event definitions
```

---

## 🔑 Demo Access Accounts & Credentials

Fast role-switching is available via the **Demo Access Switcher** in the top navigation bar:

| Role | Email | Password | Primary Capabilities |
|---|---|---|---|
| **Patient** | `patient@hospital.com` | `password123` | Active queue ticket pass, position counter, AI wait estimate, interactive floor map path to room |
| **Receptionist** | `receptionist@hospital.com` | `password123` | Live triage queue table, walk-in appointment registration, QR code check-in scanner, category override |
| **Doctor** | `doctor@hospital.com` | `password123` | Room status toggle, **"CALL NEXT PATIENT"** Web Speech voice broadcast, patient symptom summary, discharge |
| **Hospital Admin** | `admin@hospital.com` | `password123` | Real-time analytics, room utilization matrix, physician workload, Code Red Emergency Override |

---

## 💡 Key Features Implemented

1. **Smart Triage Engine & Room Allocation:**
   - `Emergency` (`E-001..E-999`): Rooms 101–105 | Target 0 min | Emergency Physician
   - `Urgent` (`U-001..U-999`): Rooms 201–205 | Target <15 min | General Physician
   - `Priority` (`P-001..P-999`): Rooms 301–305 | Target <30 min | Specialist
   - `General` (`G-001..G-999`): Rooms 401–420 | Standard queue | General OPD

2. **Interactive Visual Hospital Floor Map:**
   - SVG floor map highlighting Emergency, Urgent Care, Priority Clinic, OPD Wings, Pharmacy, and Laboratory.
   - Dynamic path generator highlighting shortest directional route from Main Entrance to the patient's assigned room.

3. **Web Speech API Voice Announcements:**
   - Audio synthesizer announcing ticket calls across hospital speakers (*"Attention please. Ticket E-001, please proceed to Room 101"*).

4. **QR Code Digital Check-In:**
   - Automatic QR pass generation for patient tickets and camera scanner interface for reception check-in.

5. **Multi-Language (i18n) & Dark Mode:**
   - Multi-language support (English, Spanish, Hindi) and dark/light theme switch.

---

## 🛠 Setup & Manual Execution Commands

### Prerequisites
- Node.js (v20+) and npm

### 1. Start Backend Server
```bash
cd backend
npm install
node node_modules/prisma/build/index.js db push
npm run db:seed
npm run dev
```
*Backend runs on `http://localhost:5000`.*

### 2. Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📜 Verification Results
- **REST APIs:** `/api/auth`, `/api/queue/live`, `/api/rooms`, `/api/analytics/summary` verified.
- **Database:** Prisma SQLite database `dev.db` fully synced and seeded.
- **WebSockets:** Real-time Socket.IO dispatches connected on port 5000.
