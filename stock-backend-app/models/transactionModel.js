import db from '../config/database.js';

const getTransactions = async () => {
  const result = await db.query('SELECT * FROM transactions');
  return result.rows.map((stock) => ({
    ...stock,
    price: Number(stock.price),
    quantity: Number(stock.quantity),
  }));
};

const getTransactionsFiltered = async (filters) => {
  let query = 'SELECT * FROM transactions';
  const values = [];
  const conditions = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      conditions.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const result = await db.query(query, values);
  return result.rows.map((stock) => ({
    ...stock,
    price: Number(stock.price),
    quantity: Number(stock.quantity),
  }));
};

const createTransaction = async (userId, stockId, type, quantity, price) => {
  const result = await db.query(
    'INSERT INTO transactions (user_id, stock_id, type, quantity, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, stockId, type, quantity, price],
  );

  return {
    ...result.rows[0],
    price: Number(result.rows[0].price),
    quantity: Number(result.rows[0].quantity),
  };
};

const deleteTransaction = async (id) => {
  const result = await db.query(
    'DELETE FROM transactions WHERE id = $1 RETURNING *',
    [id],
  );

  return {
    ...result.rows[0],
    price: Number(result.rows[0].price),
    quantity: Number(result.rows[0].quantity),
  };
};

const updateTransaction = async (
  id,
  userId,
  stockId,
  type,
  quantity,
  price,
) => {
  const result = await db.query(
    `UPDATE transactions
     SET user_id = $1, stock_id = $2, type = $3, quantity = $4, price = $5
     WHERE id = $6
     RETURNING *`,
    [userId, stockId, type, quantity, price, id],
  );

  return {
    ...result.rows[0],
    price: Number(result.rows[0].price),
    quantity: Number(result.rows[0].quantity),
  };
};

export {
  getTransactions,
  getTransactionsFiltered,
  createTransaction,
  deleteTransaction,
  updateTransaction,
};
