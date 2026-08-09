import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../shared';

let ioInstance: Server | null = null;

export const initSockets = (io: Server) => {
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

export const broadcastQueueUpdate = (data: any) => {
  if (ioInstance) {
    ioInstance.emit(SOCKET_EVENTS.QUEUE_UPDATED, data);
  }
};

export const broadcastTicketCall = (data: { ticketNumber: string; roomNumber: string; doctorName: string; patientId: string }) => {
  if (ioInstance) {
    ioInstance.emit(SOCKET_EVENTS.TICKET_CALLED, data);
    ioInstance.to(data.patientId).emit(SOCKET_EVENTS.PATIENT_NOTIFICATION, {
      title: 'Your turn!',
      message: `Ticket ${data.ticketNumber}, please proceed to Room ${data.roomNumber}`,
      type: 'SUCCESS'
    });
  }
};

export const broadcastEmergencyAlert = (data: any) => {
  if (ioInstance) {
    ioInstance.emit(SOCKET_EVENTS.EMERGENCY_ALERT, data);
  }
};

export const broadcastRoomStatus = (data: any) => {
  if (ioInstance) {
    ioInstance.emit(SOCKET_EVENTS.ROOM_STATUS_CHANGED, data);
  }
};
