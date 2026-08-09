import { Request, Response } from 'express';
import { prisma } from '../services/db';
import { broadcastRoomStatus } from '../sockets/queueSockets';

export class RoomController {
  static async getRooms(req: Request, res: Response) {
    try {
      const rooms = await prisma.room.findMany({
        include: {
          doctors: { include: { user: true } }
        },
        orderBy: { roomNumber: 'asc' }
      });

      const formatted = rooms.map(room => ({
        id: room.id,
        roomNumber: room.roomNumber,
        floor: room.floor,
        wing: room.wing,
        category: room.category,
        doctorType: room.doctorType,
        isOccupied: room.isOccupied,
        currentTicketId: room.currentTicketId,
        doctorName: room.doctors[0]?.user.name || 'Unassigned',
        doctorId: room.doctors[0]?.id
      }));

      return res.json(formatted);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to fetch rooms' });
    }
  }

  static async toggleRoomOccupancy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const room = await prisma.room.findUnique({ where: { id } });
      if (!room) return res.status(404).json({ message: 'Room not found' });

      const updated = await prisma.room.update({
        where: { id },
        data: { isOccupied: !room.isOccupied }
      });

      broadcastRoomStatus({ roomId: updated.id, isOccupied: updated.isOccupied });

      return res.json(updated);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to toggle room' });
    }
  }
}
