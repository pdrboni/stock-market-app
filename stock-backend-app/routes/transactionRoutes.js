import express from 'express';
import {
  getTransactions,
  getTransactionsFiltered,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/transactions', authMiddleware, getTransactions);
router.get('/transactions/filter', authMiddleware, getTransactionsFiltered);
router.post('/transactions', authMiddleware, createTransaction);
router.delete('/transactions', authMiddleware, deleteTransaction);
router.put('/transactions', authMiddleware, updateTransaction);

export default router;
