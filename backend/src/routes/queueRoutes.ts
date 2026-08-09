import { Router } from 'express';
import { QueueController } from '../controllers/queueController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

router.post('/book', QueueController.bookAppointment);
router.get('/live', QueueController.getLiveQueue);
router.get('/my-ticket', authenticateToken, QueueController.getMyTicket);
router.post('/call-next', authenticateToken, requireRoles('DOCTOR', 'RECEPTIONIST', 'ADMIN'), QueueController.callNextTicket);
router.patch('/:id/status', authenticateToken, requireRoles('DOCTOR', 'RECEPTIONIST', 'ADMIN'), QueueController.updateStatus);
router.post('/emergency-override', authenticateToken, requireRoles('DOCTOR', 'ADMIN', 'RECEPTIONIST'), QueueController.emergencyOverride);

export default router;
