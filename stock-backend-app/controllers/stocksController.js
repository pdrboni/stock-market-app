import stocksService from '../services/stocksServices.js';

const getStocks = async (req, res) => {
  try {
    const stocks = await stocksService.getStocks();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStocksFiltered = async (req, res) => {
  try {
    const filters = req.query;
    const stocks = await stocksService.getStocksFiltered(filters);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStock = async (req, res) => {
  try {
    const { symbol, name, current_price, currency, sector, current_volume } =
      req.body;

    const stock = await stocksService.createStock(
      symbol,
      name,
      current_price,
      currency,
      sector,
      current_volume,
    );

    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStock = async (req, res) => {
  try {
    const { id } = req.body;

    const stock = await stocksService.deleteStock(id);

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const {
      symbol,
      name,
      current_price,
      id,
      currency,
      sector,
      current_volume,
    } = req.body;

    const stock = await stocksService.updateStock(
      id,
      symbol,
      name,
      current_price,
      currency,
      sector,
      current_volume,
    );

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getStocks, getStocksFiltered, createStock, deleteStock, updateStock };
