import express from 'express';
import {
  getCharts,
  getChartsFiltered,
  createChart,
  deleteChart,
  updateChart,
} from '../controllers/chartController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/charts', authMiddleware, getCharts);
router.get('/charts/filter', authMiddleware, getChartsFiltered);
router.post('/charts', authMiddleware, createChart);
router.delete('/charts', authMiddleware, deleteChart);
router.put('/charts', authMiddleware, updateChart);

export default router;
