export enum UserRole {
  PATIENT = 'PATIENT',
  RECEPTIONIST = 'RECEPTIONIST',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export enum QueueCategory {
  EMERGENCY = 'EMERGENCY',
  URGENT = 'URGENT',
  PRIORITY = 'PRIORITY',
  GENERAL = 'GENERAL'
}

export enum AppointmentStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_CONSULTATION = 'IN_CONSULTATION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum DoctorStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  OFF_DUTY = 'OFF_DUTY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  department: string;
  roomId?: string;
  roomNumber?: string;
  status: DoctorStatus;
  patientsServedToday: number;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  wing: string;
  category: QueueCategory;
  doctorType: string;
  isOccupied: boolean;
  currentTicketId?: string;
  doctorId?: string;
  doctorName?: string;
}

export interface Appointment {
  id: string;
  ticketNumber: string; // e.g. E-001, U-003, P-002, G-012
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientAge?: number;
  category: QueueCategory;
  symptoms: string;
  triageScore: number; // 1 (General) to 4 (Emergency)
  status: AppointmentStatus;
  doctorId?: string;
  doctorName?: string;
  roomId?: string;
  roomNumber?: string;
  estimatedWaitMinutes: number;
  positionInQueue: number;
  qrCodeData: string;
  createdAt: string;
  checkedInAt?: string;
  calledAt?: string;
  completedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'EMERGENCY';
  read: boolean;
  createdAt: string;
}

export interface QueueSummary {
  totalWaiting: number;
  emergencyCount: number;
  urgentCount: number;
  priorityCount: number;
  generalCount: number;
  avgWaitMinutes: number;
  activeRoomsCount: number;
  totalServedToday: number;
}

export interface RoomUtilization {
  roomNumber: string;
  category: QueueCategory;
  status: 'FREE' | 'OCCUPIED' | 'MAINTENANCE';
  currentTicket?: string;
  doctorName?: string;
  utilizationRatePercentage: number;
}

export interface DoctorWorkload {
  doctorId: string;
  doctorName: string;
  department: string;
  completedToday: number;
  inQueue: number;
  avgConsultationTimeMins: number;
}

// Category Configuration rules
export const CATEGORY_CONFIG: Record<QueueCategory, {
  prefix: string;
  label: string;
  colorHex: string;
  badgeClass: string;
  targetMinutes: number;
  triageScore: number;
  roomRange: string;
  doctorType: string;
}> = {
  [QueueCategory.EMERGENCY]: {
    prefix: 'E',
    label: 'Emergency',
    colorHex: '#ef4444',
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300',
    targetMinutes: 0,
    triageScore: 4,
    roomRange: '101 - 105',
    doctorType: 'Emergency Physician'
  },
  [QueueCategory.URGENT]: {
    prefix: 'U',
    label: 'Urgent',
    colorHex: '#f97316',
    badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300',
    targetMinutes: 15,
    triageScore: 3,
    roomRange: '201 - 205',
    doctorType: 'General Physician'
  },
  [QueueCategory.PRIORITY]: {
    prefix: 'P',
    label: 'Priority',
    colorHex: '#eab308',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    targetMinutes: 30,
    triageScore: 2,
    roomRange: '301 - 305',
    doctorType: 'Specialist'
  },
  [QueueCategory.GENERAL]: {
    prefix: 'G',
    label: 'General OPD',
    colorHex: '#3b82f6',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
    targetMinutes: 60,
    triageScore: 1,
    roomRange: '401 - 420',
    doctorType: 'General OPD'
  }
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  QUEUE_UPDATED: 'queue_updated',
  TICKET_CALLED: 'ticket_called',
  ROOM_STATUS_CHANGED: 'room_status_changed',
  EMERGENCY_ALERT: 'emergency_alert',
  PATIENT_NOTIFICATION: 'patient_notification'
};
