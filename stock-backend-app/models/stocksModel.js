import db from '../config/database.js';

const getStocks = async () => {
  const result = await db.query('SELECT * FROM stocks');
  return result.rows.map((stock) => ({
    ...stock,
    current_price: Number(stock.current_price),
    current_volume: Number(stock.current_volume),
  }));
};

const getStocksFiltered = async (filters) => {
  let query = 'SELECT * FROM stocks';
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
    current_price: Number(stock.current_price),
    current_volume: Number(stock.current_volume),
  }));
};

const createStock = async (
  symbol,
  name,
  current_price,
  currency,
  sector,
  current_volume,
) => {
  const result = await db.query(
    'INSERT INTO stocks (symbol, name, current_price, currency, sector, current_volume) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [symbol, name, current_price, currency, sector, current_volume],
  );

  return result.rows[0];
};

const deleteStock = async (id) => {
  const result = await db.query(
    'DELETE FROM stocks WHERE id = $1 RETURNING *',
    [id],
  );

  return result.rows[0];
};

const updateStock = async (
  id,
  symbol,
  name,
  current_price,
  currency,
  sector,
  current_volume,
) => {
  const result = await db.query(
    `UPDATE stocks
     SET symbol = $1, name = $2, current_price = $3, currency = $5, sector = $6, current_volume = $7
     WHERE id = $4
     RETURNING *`,
    [symbol, name, current_price, id, currency, sector, current_volume],
  );

  return result.rows[0];
};

export { getStocks, getStocksFiltered, createStock, deleteStock, updateStock };
