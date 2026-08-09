import { Router } from 'express';
import { RoomController } from '../controllers/roomController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', RoomController.getRooms);
router.patch('/:id/toggle', authenticateToken, RoomController.toggleRoomOccupancy);

export default router;
