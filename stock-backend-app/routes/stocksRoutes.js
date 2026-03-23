import express from 'express';
import {
  getStocks,
  getStocksFiltered,
  createStock,
  deleteStock,
  updateStock,
} from '../controllers/stocksController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/stocks', authMiddleware, getStocks);
router.get('/stocks/filter', authMiddleware, getStocksFiltered);
router.post('/stocks', authMiddleware, createStock);
router.delete('/stocks', authMiddleware, deleteStock);
router.put('/stocks', authMiddleware, updateStock);

export default router;
