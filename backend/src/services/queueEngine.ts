import { prisma } from './db';
import { QueueCategory, CATEGORY_CONFIG } from '../shared';

export interface SymptomEvaluation {
  category: QueueCategory;
  triageScore: number;
  reason: string;
}

export class QueueEngine {
  /**
   * Determine category & triage score based on reported symptoms & age/disability inputs
   */
  static evaluateSymptoms(symptoms: string, age?: number, isPriority?: boolean): SymptomEvaluation {
    const s = symptoms.toLowerCase();

    // 1. Emergency keywords
    const emergencyKeywords = ['heart attack', 'stroke', 'heavy bleeding', 'unconscious', 'chest pain', 'cardiac', 'severe trauma', 'seizure', 'cannot breathe'];
    if (emergencyKeywords.some(k => s.includes(k))) {
      return {
        category: QueueCategory.EMERGENCY,
        triageScore: 4,
        reason: 'Critical symptoms detected requiring immediate emergency intervention.'
      };
    }

    // 2. Urgent keywords or age conditions
    const urgentKeywords = ['high fever', 'severe pain', 'fracture', 'burn', 'pregnant', 'bleeding', 'vomiting blood', 'shortness of breath'];
    if (urgentKeywords.some(k => s.includes(k)) || (age && (age >= 70 || age <= 5))) {
      return {
        category: QueueCategory.URGENT,
        triageScore: 3,
        reason: 'Urgent medical attention recommended within 15 minutes.'
      };
    }

    // 3. Priority condition
    const priorityKeywords = ['disabled', 'wheelchair', 'post-surgery', 'chronic', 'diabetes complication', 'dialysis', 'oncology'];
    if (isPriority || priorityKeywords.some(k => s.includes(k))) {
      return {
        category: QueueCategory.PRIORITY,
        triageScore: 2,
        reason: 'Priority allocation for vulnerable or specialized follow-up care.'
      };
    }

    // 4. Default General
    return {
      category: QueueCategory.GENERAL,
      triageScore: 1,
      reason: 'General OPD routine consultation.'
    };
  }

  /**
   * Generate next sequential ticket number e.g. E-001, U-004
   */
  static async generateTicketNumber(category: QueueCategory): Promise<string> {
    const config = CATEGORY_CONFIG[category];
    const prefix = config.prefix;

    const count = await prisma.appointment.count({
      where: { category }
    });

    const num = (count + 1).toString().padStart(3, '0');
    return `${prefix}-${num}`;
  }

  /**
   * Room allocation based on category
   */
  static async allocateRoomAndDoctor(category: QueueCategory): Promise<{ roomId?: string; roomNumber?: string; doctorId?: string; doctorName?: string }> {
    // Search for available rooms in the target range for this category
    const rooms = await prisma.room.findMany({
      where: { category },
      include: {
        doctors: {
          where: { status: 'AVAILABLE' },
          include: { user: true }
        }
      }
    });

    // 1. Try to find a room with an available doctor
    for (const room of rooms) {
      if (room.doctors && room.doctors.length > 0) {
        const doctor = room.doctors[0];
        return {
          roomId: room.id,
          roomNumber: room.roomNumber,
          doctorId: doctor.id,
          doctorName: doctor.user.name
        };
      }
    }

    // 2. If no direct room with assigned doctor found, pick any available doctor matching department
    const availableDoctor = await prisma.doctor.findFirst({
      where: { status: 'AVAILABLE' },
      include: { user: true, room: true }
    });

    if (availableDoctor) {
      return {
        roomId: availableDoctor.roomId || undefined,
        roomNumber: availableDoctor.room?.roomNumber || undefined,
        doctorId: availableDoctor.id,
        doctorName: availableDoctor.user.name
      };
    }

    // Fallback: assign first room in category
    if (rooms.length > 0) {
      return {
        roomId: rooms[0].id,
        roomNumber: rooms[0].roomNumber
      };
    }

    return {};
  }

  /**
   * AI Wait Time Heuristic Prediction
   */
  static async predictWaitTimeMinutes(category: QueueCategory): Promise<{ estimatedMinutes: number; queuePosition: number }> {
    // Count how many patients are waiting in queue ahead with higher or equal triage priority
    const waitingAhead = await prisma.appointment.count({
      where: {
        status: 'WAITING',
        triageScore: { gte: CATEGORY_CONFIG[category].triageScore }
      }
    });

    const activeDoctorsCount = await prisma.doctor.count({
      where: { status: 'AVAILABLE' }
    }) || 1;

    // Average consultation time per patient = 10 mins
    const avgConsultationMinutes = 10;

    // Calculate heuristic
    let estimated = Math.ceil((waitingAhead * avgConsultationMinutes) / activeDoctorsCount);

    // Apply minimum target floor per category
    if (category === QueueCategory.EMERGENCY) estimated = 0;
    else if (estimated < 5) estimated = 5;

    return {
      estimatedMinutes: estimated,
      queuePosition: waitingAhead + 1
    };
  }
}
