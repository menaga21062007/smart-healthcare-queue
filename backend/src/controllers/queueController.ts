import { Response } from 'express';
import { prisma } from '../services/db';
import { AuthRequest } from '../middleware/auth';
import { QueueEngine } from '../services/queueEngine';
import { broadcastQueueUpdate, broadcastTicketCall, broadcastEmergencyAlert } from '../sockets/queueSockets';
import { NotificationService } from '../services/notificationService';
import { QueueCategory, AppointmentStatus } from '../shared';

export class QueueController {
  /**
   * Book / Register appointment with automated triage & room allocation
   */
  static async bookAppointment(req: AuthRequest, res: Response) {
    try {
      const { symptoms, patientAge, isPriority, patientName, patientPhone } = req.body;
      const patientId = req.user ? req.user.id : (req.body.patientId || null);

      if (!symptoms) {
        return res.status(400).json({ message: 'Symptoms description is required' });
      }

      // 1. Symptom Triage Evaluation
      const triage = QueueEngine.evaluateSymptoms(symptoms, patientAge, isPriority);

      // 2. Generate Ticket Number with prefix
      const ticketNumber = await QueueEngine.generateTicketNumber(triage.category);

      // 3. Allocate Room & Doctor
      const allocation = await QueueEngine.allocateRoomAndDoctor(triage.category);

      // 4. Calculate AI Wait Time Heuristic
      const waitPrediction = await QueueEngine.predictWaitTimeMinutes(triage.category);

      // QR Code payload data string
      const qrCodeData = JSON.stringify({
        ticketNumber,
        category: triage.category,
        timestamp: new Date().toISOString()
      });

      // Find or get patient name
      let finalPatientId = patientId;
      let finalPatientName = patientName || 'Guest Patient';

      if (patientId) {
        const user = await prisma.user.findUnique({ where: { id: patientId } });
        if (user) finalPatientName = user.name;
      } else {
        // Create quick guest patient user if needed
        const guest = await prisma.user.create({
          data: {
            email: `patient_${Date.now()}@guest.com`,
            name: finalPatientName,
            passwordHash: 'guest_hash',
            role: 'PATIENT',
            phone: patientPhone
          }
        });
        finalPatientId = guest.id;
      }

      // 5. Create Appointment in DB
      const appointment = await prisma.appointment.create({
        data: {
          ticketNumber,
          patientId: finalPatientId,
          category: triage.category,
          symptoms,
          triageScore: triage.triageScore,
          status: 'WAITING',
          estimatedWaitMinutes: waitPrediction.estimatedMinutes,
          qrCodeData,
          doctorId: allocation.doctorId,
          roomId: allocation.roomId,
          checkedInAt: new Date()
        },
        include: {
          patient: true,
          doctor: { include: { user: true } },
          room: true
        }
      });

      // 6. Notify Patient
      await NotificationService.createNotification(
        finalPatientId,
        'Appointment Confirmed',
        `Ticket ${ticketNumber} assigned to ${triage.category} queue. Estimated wait: ~${waitPrediction.estimatedMinutes} mins.`,
        triage.category === QueueCategory.EMERGENCY ? 'EMERGENCY' : 'INFO'
      );

      // 7. Emit WebSocket Queue Update
      broadcastQueueUpdate({
        event: 'NEW_BOOKING',
        ticketNumber,
        category: triage.category,
        roomNumber: allocation.roomNumber
      });

      if (triage.category === QueueCategory.EMERGENCY) {
        broadcastEmergencyAlert({
          ticketNumber,
          patientName: finalPatientName,
          symptoms,
          roomNumber: allocation.roomNumber || '101'
        });
      }

      return res.status(201).json({
        id: appointment.id,
        ticketNumber: appointment.ticketNumber,
        category: appointment.category,
        symptoms: appointment.symptoms,
        triageScore: appointment.triageScore,
        triageReason: triage.reason,
        status: appointment.status,
        patientId: finalPatientId,
        patientName: finalPatientName,
        roomNumber: allocation.roomNumber || 'Pending',
        doctorName: allocation.doctorName || 'Assigned Physician',
        estimatedWaitMinutes: waitPrediction.estimatedMinutes,
        positionInQueue: waitPrediction.queuePosition,
        qrCodeData: appointment.qrCodeData,
        createdAt: appointment.createdAt
      });
    } catch (err) {
      console.error('Booking error:', err);
      return res.status(500).json({ message: 'Failed to book appointment' });
    }
  }

  /**
   * Get Live Queue
   */
  static async getLiveQueue(req: AuthRequest, res: Response) {
    try {
      const appointments = await prisma.appointment.findMany({
        where: {
          status: { in: ['WAITING', 'CALLED', 'IN_CONSULTATION'] }
        },
        include: {
          patient: true,
          doctor: { include: { user: true } },
          room: true
        },
        orderBy: [
          { triageScore: 'desc' },
          { createdAt: 'asc' }
        ]
      });

      const formatted = appointments.map((app, index) => ({
        id: app.id,
        ticketNumber: app.ticketNumber,
        patientId: app.patientId,
        patientName: app.patient.name,
        patientPhone: app.patient.phone,
        category: app.category,
        symptoms: app.symptoms,
        triageScore: app.triageScore,
        status: app.status,
        doctorId: app.doctorId,
        doctorName: app.doctor?.user.name,
        roomId: app.roomId,
        roomNumber: app.room?.roomNumber,
        estimatedWaitMinutes: app.estimatedWaitMinutes,
        positionInQueue: index + 1,
        qrCodeData: app.qrCodeData,
        createdAt: app.createdAt,
        calledAt: app.calledAt
      }));

      return res.json(formatted);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to fetch queue' });
    }
  }

  /**
   * Get patient's active ticket
   */
  static async getMyTicket(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

      const app = await prisma.appointment.findFirst({
        where: {
          patientId: req.user.id,
          status: { in: ['WAITING', 'CALLED', 'IN_CONSULTATION'] }
        },
        include: {
          doctor: { include: { user: true } },
          room: true
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!app) return res.json(null);

      // Find position in queue
      const aheadCount = await prisma.appointment.count({
        where: {
          status: 'WAITING',
          triageScore: { gte: app.triageScore },
          createdAt: { lt: app.createdAt }
        }
      });

      return res.json({
        id: app.id,
        ticketNumber: app.ticketNumber,
        category: app.category,
        symptoms: app.symptoms,
        status: app.status,
        doctorName: app.doctor?.user.name || 'General Physician',
        roomNumber: app.room?.roomNumber || '101',
        estimatedWaitMinutes: app.estimatedWaitMinutes,
        positionInQueue: aheadCount + 1,
        qrCodeData: app.qrCodeData,
        createdAt: app.createdAt
      });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to fetch ticket' });
    }
  }

  /**
   * Doctor calls next ticket
   */
  static async callNextTicket(req: AuthRequest, res: Response) {
    try {
      const { doctorId, roomNumber } = req.body;

      // Find next highest priority waiting patient
      const nextTicket = await prisma.appointment.findFirst({
        where: { status: 'WAITING' },
        include: { patient: true, room: true },
        orderBy: [
          { triageScore: 'desc' },
          { createdAt: 'asc' }
        ]
      });

      if (!nextTicket) {
        return res.status(404).json({ message: 'No waiting patients in queue' });
      }

      // Find assigned doctor
      const doc = doctorId ? await prisma.doctor.findUnique({ where: { id: doctorId }, include: { user: true, room: true } }) : null;
      const targetRoomNumber = roomNumber || doc?.room?.roomNumber || nextTicket.room?.roomNumber || '101';

      // Update appointment status to CALLED
      const updated = await prisma.appointment.update({
        where: { id: nextTicket.id },
        data: {
          status: 'CALLED',
          calledAt: new Date(),
          doctorId: doc?.id || nextTicket.doctorId
        },
        include: { patient: true, doctor: { include: { user: true } }, room: true }
      });

      const doctorName = doc?.user.name || 'Duty Doctor';

      // Broadcast Socket Voice Call Notification
      broadcastTicketCall({
        ticketNumber: updated.ticketNumber,
        roomNumber: targetRoomNumber,
        doctorName,
        patientId: updated.patientId
      });

      broadcastQueueUpdate({ event: 'TICKET_CALLED', ticketNumber: updated.ticketNumber });

      // Notify Patient
      await NotificationService.createNotification(
        updated.patientId,
        'Now Calling!',
        `Please proceed to Room ${targetRoomNumber} for consultation with Dr. ${doctorName}`,
        'SUCCESS'
      );

      return res.json({
        message: `Ticket ${updated.ticketNumber} called to Room ${targetRoomNumber}`,
        appointment: {
          id: updated.id,
          ticketNumber: updated.ticketNumber,
          patientName: updated.patient.name,
          roomNumber: targetRoomNumber,
          doctorName,
          status: updated.status
        }
      });
    } catch (err) {
      console.error('Call next error:', err);
      return res.status(500).json({ message: 'Failed to call ticket' });
    }
  }

  /**
   * Update Appointment Status (IN_CONSULTATION, COMPLETED, CANCELLED)
   */
  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const app = await prisma.appointment.findUnique({ where: { id } });
      if (!app) return res.status(404).json({ message: 'Appointment not found' });

      const dataToUpdate: any = { status };
      if (status === 'COMPLETED') {
        dataToUpdate.completedAt = new Date();
        if (app.doctorId) {
          await prisma.doctor.update({
            where: { id: app.doctorId },
            data: { patientsServedToday: { increment: 1 } }
          });
        }
      }

      const updated = await prisma.appointment.update({
        where: { id },
        data: dataToUpdate
      });

      broadcastQueueUpdate({ event: 'STATUS_CHANGED', ticketNumber: app.ticketNumber, status });

      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to update status' });
    }
  }

  /**
   * Emergency Override: Inject emergency ticket directly
   */
  static async emergencyOverride(req: AuthRequest, res: Response) {
    try {
      const { patientName, symptoms = 'Severe Critical Emergency' } = req.body;

      const ticketNumber = await QueueEngine.generateTicketNumber(QueueCategory.EMERGENCY);

      const guest = await prisma.user.create({
        data: {
          email: `emergency_${Date.now()}@hospital.com`,
          name: patientName || 'Emergency Patient',
          passwordHash: 'emergency',
          role: 'PATIENT'
        }
      });

      const appointment = await prisma.appointment.create({
        data: {
          ticketNumber,
          patientId: guest.id,
          category: QueueCategory.EMERGENCY,
          symptoms,
          triageScore: 4,
          status: 'CALLED',
          estimatedWaitMinutes: 0,
          qrCodeData: JSON.stringify({ ticketNumber, category: 'EMERGENCY' }),
          calledAt: new Date()
        }
      });

      broadcastEmergencyAlert({
        ticketNumber,
        patientName: guest.name,
        symptoms,
        roomNumber: '101 (Emergency ER)'
      });

      broadcastQueueUpdate({ event: 'EMERGENCY_OVERRIDE', ticketNumber });

      return res.status(201).json(appointment);
    } catch (err) {
      return res.status(500).json({ message: 'Emergency override failed' });
    }
  }
}
