import stockPricesService from '../services/stockPricesServices.js';

const getStockPrices = async (req, res) => {
  try {
    const stockPrices = await stockPricesService.getStockPrices();
    res.json(stockPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStockPrice = async (req, res) => {
  try {
    const { stock_id, open, close, high, low, interval, volume, price_time } =
      req.body;

    const stockPrice = await stockPricesService.createStockPrice(
      stock_id,
      open,
      close,
      high,
      low,
      volume,
      price_time,
      interval,
    );

    res.status(201).json(stockPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStockPrice = async (req, res) => {
  try {
    const { id } = req.body;

    const stockPrice = await stockPricesService.deleteStockPrice(id);

    res.status(200).json(stockPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStockPrice = async (req, res) => {
  try {
    const { id, stockId, open, close, high, low, volume, interval, priceTime } =
      req.body;

    const stockPrice = await stockPricesService.updateStockPrice(
      id,
      stockId,
      open,
      close,
      high,
      low,
      volume,
      interval,
      priceTime,
    );

    res.status(200).json(stockPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getStockPrices, createStockPrice, deleteStockPrice, updateStockPrice };
