import express from 'express';
import {
  getStockPrices,
  createStockPrice,
  deleteStockPrice,
  updateStockPrice,
  getStockPricesFiltered,
} from '../controllers/stockPricesController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/stock-prices', authMiddleware, getStockPrices);
router.get('/stock-prices/filter', authMiddleware, getStockPricesFiltered);
router.post('/stock-prices', authMiddleware, createStockPrice);
router.delete('/stock-prices', authMiddleware, deleteStockPrice);
router.put('/stock-prices', authMiddleware, updateStockPrice);

export default router;
