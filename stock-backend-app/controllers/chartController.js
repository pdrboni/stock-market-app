import chartService from '../services/chartServices.js';

const getCharts = async (req, res) => {
  try {
    const charts = await chartService.getCharts();
    res.json(charts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChartsFiltered = async (req, res) => {
  try {
    const filters = req.query;
    const charts = await chartService.getChartsFiltered(filters);
    res.json(charts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createChart = async (req, res) => {
  try {
    const { user_id, stock_id, quantity, avg_price } = req.body;

    const chart = await chartService.createChart(
      user_id,
      stock_id,
      quantity,
      avg_price,
    );

    res.status(201).json(chart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteChart = async (req, res) => {
  try {
    const { user_id, stock_id } = req.body;

    const chart = await chartService.deleteChart(user_id, stock_id);

    res.status(200).json(chart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChart = async (req, res) => {
  try {
    const { user_id, stock_id, quantity, avg_price, id } = req.body;

    const chart = await chartService.updateChart(
      id,
      user_id,
      stock_id,
      quantity,
      avg_price,
    );

    res.status(200).json(chart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getCharts, getChartsFiltered, createChart, deleteChart, updateChart };
