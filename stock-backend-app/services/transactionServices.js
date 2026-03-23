import * as transactionModel from '../models/transactionModel.js';

const createTransaction = async (userId, stockId, type, quantity, price) => {
  return transactionModel.createTransaction(
    userId,
    stockId,
    type,
    quantity,
    price,
  );
};

const getTransactions = async () => {
  return transactionModel.getTransactions();
};

const getTransactionsFiltered = async (filters) => {
  return transactionModel.getTransactionsFiltered(filters);
};

const deleteTransaction = async (id) => {
  const transaction = await transactionModel.deleteTransaction(id);

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  return transaction;
};

const updateTransaction = async (
  id,
  userId,
  stockId,
  type,
  quantity,
  price,
) => {
  const transaction = await transactionModel.updateTransaction(
    id,
    userId,
    stockId,
    type,
    quantity,
    price,
  );

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  return transaction;
};

export default {
  createTransaction,
  getTransactions,
  getTransactionsFiltered,
  deleteTransaction,
  updateTransaction,
};
