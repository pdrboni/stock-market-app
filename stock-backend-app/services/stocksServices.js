import * as stocksModel from '../models/stocksModel.js';

const createStock = async (
  symbol,
  name,
  current_price,
  currency,
  sector,
  current_volume,
) => {
  // TODO: createStock auth.
  if (
    !symbol ||
    !name ||
    current_price == null ||
    !currency ||
    !sector ||
    !current_volume
  ) {
    throw new Error(
      'symbol, name, current_price, currency, sector, current_volume are required',
    );
  }
  if (typeof current_price !== 'number' || current_price < 0) {
    throw new Error('current_price must be a positive number');
  }

  const stock = await stocksModel.createStock(
    symbol,
    name,
    current_price,
    currency,
    sector,
    current_volume,
  );

  return {
    ...stock,
    current_price: stock.current_price ? Number(stock.current_price) : null,
    current_volume: stock.current_volume ? Number(stock.current_volume) : null,
  };
};

const getStocks = async () => {
  return stocksModel.getStocks();
};

const getStocksFiltered = async (filters) => {
  return stocksModel.getStocksFiltered(filters);
};

const deleteStock = async (id) => {
  const stock = await stocksModel.deleteStock(id);

  if (!stock) {
    throw new Error('Stock not found');
  }

  return {
    ...stock,
    current_price: stock.current_price ? Number(stock.current_price) : null,
    current_volume: stock.current_volume ? Number(stock.current_volume) : null,
  };
};

// TODO: updateStock auth.
const updateStock = async (
  id,
  symbol,
  name,
  current_price,
  currency,
  sector,
  current_volume,
) => {
  // Basic validation
  if (!symbol || !name || current_price == null) {
    throw new Error(
      'symbol, name, current_price, currency, sector, current_volume are required',
    );
  }
  if (typeof current_price !== 'number' || current_price < 0) {
    throw new Error('current_price must be a positive number');
  }

  const stock = await stocksModel.updateStock(
    id,
    symbol,
    name,
    current_price,
    currency,
    sector,
    current_volume,
  );

  if (!stock) {
    throw new Error('Stock not found');
  }

  return {
    ...stock,
    current_price: stock.current_price ? Number(stock.current_price) : null,
    current_volume: stock.current_volume ? Number(stock.current_volume) : null,
  };
};

export default {
  createStock,
  getStocks,
  getStocksFiltered,
  deleteStock,
  updateStock,
};
