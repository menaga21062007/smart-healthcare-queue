import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash default password
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Demo Users
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@hospital.com' },
    update: {},
    create: {
      email: 'patient@hospital.com',
      name: 'John Doe (Patient)',
      passwordHash,
      role: 'PATIENT',
      phone: '+1 555-0192'
    }
  });

  const receptionistUser = await prisma.user.upsert({
    where: { email: 'receptionist@hospital.com' },
    update: {},
    create: {
      email: 'receptionist@hospital.com',
      name: 'Sarah Jenkins (Reception)',
      passwordHash,
      role: 'RECEPTIONIST',
      phone: '+1 555-0193'
    }
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@hospital.com' },
    update: {},
    create: {
      email: 'doctor@hospital.com',
      name: 'Dr. Marcus Vance',
      passwordHash,
      role: 'DOCTOR',
      phone: '+1 555-0194'
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      email: 'admin@hospital.com',
      name: 'Elena Rostova (Admin)',
      passwordHash,
      role: 'ADMIN',
      phone: '+1 555-0195'
    }
  });

  // 2. Create Rooms
  const roomConfigs = [
    // Emergency 101-105
    { roomNumber: '101', floor: 1, wing: 'A (Emergency)', category: 'EMERGENCY', doctorType: 'Emergency Physician' },
    { roomNumber: '102', floor: 1, wing: 'A (Emergency)', category: 'EMERGENCY', doctorType: 'Emergency Physician' },
    { roomNumber: '103', floor: 1, wing: 'A (Emergency)', category: 'EMERGENCY', doctorType: 'Emergency Physician' },
    // Urgent 201-205
    { roomNumber: '201', floor: 2, wing: 'B (Urgent Care)', category: 'URGENT', doctorType: 'General Physician' },
    { roomNumber: '202', floor: 2, wing: 'B (Urgent Care)', category: 'URGENT', doctorType: 'General Physician' },
    // Priority 301-305
    { roomNumber: '301', floor: 3, wing: 'C (Specialist Wing)', category: 'PRIORITY', doctorType: 'Specialist' },
    { roomNumber: '302', floor: 3, wing: 'C (Specialist Wing)', category: 'PRIORITY', doctorType: 'Specialist' },
    // General OPD 401-405
    { roomNumber: '401', floor: 4, wing: 'D (General OPD)', category: 'GENERAL', doctorType: 'General OPD' },
    { roomNumber: '402', floor: 4, wing: 'D (General OPD)', category: 'GENERAL', doctorType: 'General OPD' },
    { roomNumber: '403', floor: 4, wing: 'D (General OPD)', category: 'GENERAL', doctorType: 'General OPD' }
  ];

  for (const r of roomConfigs) {
    await prisma.room.upsert({
      where: { roomNumber: r.roomNumber },
      update: {},
      create: r
    });
  }

  // 3. Link Doctor to Room 101 or 201
  const room101 = await prisma.room.findUnique({ where: { roomNumber: '101' } });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      specialization: 'Cardiovascular & Emergency Medicine',
      department: 'Emergency Medicine',
      roomId: room101?.id,
      status: 'AVAILABLE',
      patientsServedToday: 18
    }
  });

  // 4. Create sample initial tickets for demo
  const sampleTickets = [
    {
      ticketNumber: 'E-001',
      patientId: patientUser.id,
      category: 'EMERGENCY',
      symptoms: 'Chest tightness and shortness of breath',
      triageScore: 4,
      status: 'WAITING',
      estimatedWaitMinutes: 0,
      qrCodeData: JSON.stringify({ ticketNumber: 'E-001', category: 'EMERGENCY' }),
      roomId: room101?.id,
      doctorId: doctor.id
    },
    {
      ticketNumber: 'U-001',
      patientId: patientUser.id,
      category: 'URGENT',
      symptoms: 'Severe abdominal pain and high fever 102F',
      triageScore: 3,
      status: 'WAITING',
      estimatedWaitMinutes: 12,
      qrCodeData: JSON.stringify({ ticketNumber: 'U-001', category: 'URGENT' })
    },
    {
      ticketNumber: 'P-001',
      patientId: patientUser.id,
      category: 'PRIORITY',
      symptoms: 'Post-knee replacement surgery review',
      triageScore: 2,
      status: 'WAITING',
      estimatedWaitMinutes: 25,
      qrCodeData: JSON.stringify({ ticketNumber: 'P-001', category: 'PRIORITY' })
    },
    {
      ticketNumber: 'G-001',
      patientId: patientUser.id,
      category: 'GENERAL',
      symptoms: 'Routine blood pressure checkup and prescription refill',
      triageScore: 1,
      status: 'WAITING',
      estimatedWaitMinutes: 40,
      qrCodeData: JSON.stringify({ ticketNumber: 'G-001', category: 'GENERAL' })
    }
  ];

  for (const t of sampleTickets) {
    await prisma.appointment.upsert({
      where: { ticketNumber: t.ticketNumber },
      update: {},
      create: t
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
