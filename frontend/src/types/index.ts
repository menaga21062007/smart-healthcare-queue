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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  doctorId?: string;
  specialization?: string;
  department?: string;
  roomNumber?: string;
}

export interface Appointment {
  id: string;
  ticketNumber: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientAge?: number;
  category: QueueCategory;
  symptoms: string;
  triageScore: number;
  status: AppointmentStatus;
  doctorId?: string;
  doctorName?: string;
  roomId?: string;
  roomNumber?: string;
  estimatedWaitMinutes: number;
  positionInQueue: number;
  qrCodeData: string;
  createdAt: string;
  calledAt?: string;
}

export interface RoomItem {
  id: string;
  roomNumber: string;
  floor: number;
  wing: string;
  category: QueueCategory;
  doctorType: string;
  isOccupied: boolean;
  currentTicketId?: string;
  doctorName?: string;
  doctorId?: string;
}

export interface AnalyticsSummary {
  summary: {
    totalWaiting: number;
    emergencyCount: number;
    urgentCount: number;
    priorityCount: number;
    generalCount: number;
    avgWaitMinutes: number;
    activeRoomsCount: number;
    totalServedToday: number;
  };
  doctorWorkload: Array<{
    doctorId: string;
    doctorName: string;
    department: string;
    completedToday: number;
    inQueue: number;
    avgConsultationTimeMins: number;
  }>;
  roomUtilization: Array<{
    roomNumber: string;
    category: QueueCategory;
    status: 'FREE' | 'OCCUPIED' | 'MAINTENANCE';
    utilizationRatePercentage: number;
  }>;
  hourlyTrends: Array<{
    hour: string;
    volume: number;
    avgWait: number;
  }>;
}

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
    badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-800',
    targetMinutes: 0,
    triageScore: 4,
    roomRange: '101 - 105',
    doctorType: 'Emergency Physician'
  },
  [QueueCategory.URGENT]: {
    prefix: 'U',
    label: 'Urgent',
    colorHex: '#f97316',
    badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-800',
    targetMinutes: 15,
    triageScore: 3,
    roomRange: '201 - 205',
    doctorType: 'General Physician'
  },
  [QueueCategory.PRIORITY]: {
    prefix: 'P',
    label: 'Priority',
    colorHex: '#eab308',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    targetMinutes: 30,
    triageScore: 2,
    roomRange: '301 - 305',
    doctorType: 'Specialist'
  },
  [QueueCategory.GENERAL]: {
    prefix: 'G',
    label: 'General OPD',
    colorHex: '#3b82f6',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    targetMinutes: 60,
    triageScore: 1,
    roomRange: '401 - 420',
    doctorType: 'General OPD'
  }
};
