import db from '../config/database.js';

const getStockPrices = async () => {
  const result = await db.query('SELECT * FROM stock_prices');
  return result.rows.map((stock) => ({
    ...stock,
    open: Number(stock.open),
    high: Number(stock.high),
    low: Number(stock.low),
    close: Number(stock.close),
    volume: Number(stock.volume),
    id: Number(stock.id),
  }));
};

const getStockPricesFiltered = async (filters) => {
  let query = 'SELECT * FROM stock_prices';
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
    open: Number(stock.open),
    high: Number(stock.high),
    low: Number(stock.low),
    close: Number(stock.close),
    volume: Number(stock.volume),
    id: Number(stock.id),
  }));
};

const createStockPrice = async (
  stock_id,
  open,
  close,
  high,
  low,
  volume,
  priceTime,
  interval,
) => {
  const result = await db.query(
    'INSERT INTO stock_prices (stock_id, open, close, high, low, volume, price_time, interval) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [stock_id, open, close, high, low, volume, priceTime, interval],
  );
  const mapped = result.rows.map((stock) => ({
    ...stock,
    open: Number(stock.open),
    high: Number(stock.high),
    low: Number(stock.low),
    close: Number(stock.close),
    volume: Number(stock.volume),
    id: Number(stock.id),
  }));

  return mapped[0];
};

const deleteStockPrice = async (id) => {
  const result = await db.query(
    'DELETE FROM stock_prices WHERE id = $1 RETURNING *',
    [id],
  );

  return result.rows[0];
};

const updateStockPrice = async (
  id,
  stock_id,
  open,
  close,
  high,
  low,
  volume,
  priceTime,
  interval,
) => {
  const result = await db.query(
    `UPDATE stock_prices
     SET stock_id = $1, open = $2, close = $3, high = $4, low = $5, volume = $6, price_time = $7, interval = $9
     WHERE id = $8
     RETURNING *`,
    [stock_id, open, close, high, low, volume, priceTime, id, interval],
  );

  return result.rows[0];
};

export {
  getStockPrices,
  getStockPricesFiltered,
  createStockPrice,
  deleteStockPrice,
  updateStockPrice,
};
