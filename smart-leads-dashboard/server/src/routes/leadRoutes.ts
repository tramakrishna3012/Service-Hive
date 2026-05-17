import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import {
  createLeadValidator,
  updateLeadValidator,
  leadIdValidator,
} from '../validators/leadValidator';

const router = Router();

router.use(authMiddleware);

router.get('/', getLeads);
router.get('/export', exportLeadsCSV);
router.get('/:id', leadIdValidator, getLeadById);
router.post('/', createLeadValidator, createLead);
router.put('/:id', updateLeadValidator, updateLead);
router.delete('/:id', leadIdValidator, requireRole('admin'), deleteLead);

export default router;
