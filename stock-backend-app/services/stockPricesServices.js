import * as stockPricesModel from '../models/stockPricesModel.js';

const createStockPrice = async (
  stockId,
  open,
  close,
  high,
  low,
  volume,
  priceTime,
  interval,
) => {
  return stockPricesModel.createStockPrice(
    stockId,
    open,
    close,
    high,
    low,
    volume,
    priceTime,
    interval,
  );
};

const getStockPricesFiltered = async (filters) => {
  return stockPricesModel.getStockPricesFiltered(filters);
};

const getStockPrices = async () => {
  return stockPricesModel.getStockPrices();
};

const deleteStockPrice = async (id) => {
  const stockPrice = await stockPricesModel.deleteStockPrice(id);

  if (!stockPrice) {
    throw new Error('Stock price not found');
  }

  return stockPrice;
};

const updateStockPrice = async (
  id,
  stockId,
  open,
  close,
  high,
  low,
  volume,
  priceTime,
) => {
  const stockPrice = await stockPricesModel.updateStockPrice(
    id,
    stockId,
    open,
    close,
    high,
    low,
    volume,
    priceTime,
  );

  if (!stockPrice) {
    throw new Error('Stock price not found');
  }

  return stockPrice;
};

export default {
  createStockPrice,
  getStockPrices,
  getStockPricesFiltered,
  deleteStockPrice,
  updateStockPrice,
};
