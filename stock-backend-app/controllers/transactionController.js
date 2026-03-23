import transactionService from '../services/transactionServices.js';

const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionsFiltered = async (req, res) => {
  try {
    const filters = req.query;
    const transactions =
      await transactionService.getTransactionsFiltered(filters);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { user_id, stock_id, type, quantity, price } = req.body;

    const transaction = await transactionService.createTransaction(
      user_id,
      stock_id,
      type,
      quantity,
      price,
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.body;

    const transaction = await transactionService.deleteTransaction(id);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id, userId, stockId, type, quantity, price } = req.body;

    const transaction = await transactionService.updateTransaction(
      id,
      userId,
      stockId,
      type,
      quantity,
      price,
    );

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getTransactions,
  getTransactionsFiltered,
  createTransaction,
  deleteTransaction,
  updateTransaction,
};
