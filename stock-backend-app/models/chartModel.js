import db from '../config/database.js';

const getCharts = async () => {
  const result = await db.query('SELECT * FROM chart');
  return result.rows.map((stock) => ({
    ...stock,
    quantity: Number(stock.quantity),
    avg_price: Number(stock.avg_price),
  }));
};

const getChartsFiltered = async (filters) => {
  let query = 'SELECT * FROM chart';
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
    quantity: Number(stock.quantity),
    avg_price: Number(stock.avg_price),
  }));
};

const createChart = async (user_id, stock_id, quantity, avg_price) => {
  const result = await db.query(
    'INSERT INTO chart (user_id, stock_id, quantity, avg_price) VALUES ($1, $2, $3, $4) RETURNING *',
    [user_id, stock_id, quantity, avg_price],
  );

  return result.rows[0];
};

const deleteChart = async (id) => {
  const result = await db.query('DELETE FROM chart WHERE id = $1 RETURNING *', [
    id,
  ]);

  return result.rows[0];
};

const updateChart = async (id, user_id, stock_id, quantity, avg_price) => {
  const result = await db.query(
    `UPDATE chart
     SET user_id = $1, stock_id = $2, quantity = $3, avg_price = $4
     WHERE id = $5
     RETURNING *`,
    [user_id, stock_id, quantity, avg_price, id],
  );

  return result.rows[0];
};

export { getCharts, getChartsFiltered, createChart, deleteChart, updateChart };
