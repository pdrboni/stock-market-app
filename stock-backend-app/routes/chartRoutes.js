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

router.get('/charts', authMiddleware, async (req, res) => {
  const charts = await getCharts();
  res.json(charts);
});
router.get('/charts/filter', authMiddleware, async (req, res) => {
  const charts = await getChartsFiltered();
  res.json(charts);
});
router.post('/charts', authMiddleware, async (req, res) => {
  const chart = await createChart();
  res.json(chart);
});
router.delete('/charts', authMiddleware, async (req, res) => {
  const chart = await deleteChart();
  res.json(chart);
});
router.put('/charts', authMiddleware, async (req, res) => {
  const chart = await updateChart();
  res.json(chart);
});

export default router;
