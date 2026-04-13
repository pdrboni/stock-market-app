import * as chartModel from '../models/chartModel.js';

const createChart = async (user_id, stock_id, quantity, avg_price) => {
  // Basic validation
  if (!user_id || !stock_id || quantity == null) {
    throw new Error('user_id, stock_id, quantity, and avg_price are required');
  }
  if (typeof quantity !== 'number' || quantity < 0) {
    throw new Error('Quantity must be a positive number');
  }
  if (avg_price && (typeof avg_price !== 'number' || avg_price < 0)) {
    throw new Error('Avg_price must be a positive number');
  }

  const chart = await chartModel.createChart(
    user_id,
    stock_id,
    quantity,
    avg_price,
  );
  return {
    ...chart,
    quantity: Number(chart.quantity),
    avg_price: Number(chart.avg_price),
  };
};

const getCharts = async () => {
  return chartModel.getCharts();
};

const getChartsFiltered = async (filters) => {
  return chartModel.getChartsFiltered(filters);
};

const deleteChart = async (user_id, stock_id) => {
  const chart = await chartModel.deleteChart(user_id, stock_id);

  if (!chart) {
    throw new Error('Chart entry not found');
  }

  return {
    ...chart,
    quantity: Number(chart.quantity),
    avg_price: Number(chart.avg_price),
  };
};

// TODO: validate user ownership, etc.
const updateChart = async (id, user_id, stock_id, quantity, avg_price) => {
  // Basic validation
  if (!user_id || !stock_id || quantity == null || avg_price == null) {
    throw new Error('user_id, stock_id, quantity, and avg_price are required');
  }
  if (typeof quantity !== 'number' || quantity < 0) {
    throw new Error('Quantity must be a positive number');
  }
  if (typeof avg_price !== 'number' || avg_price < 0) {
    throw new Error('Avg_price must be a positive number');
  }

  const chart = await chartModel.updateChart(
    id,
    user_id,
    stock_id,
    quantity,
    avg_price,
  );

  if (!chart) {
    throw new Error('Chart entry not found');
  }

  return {
    ...chart,
    quantity: Number(chart.quantity),
    avg_price: Number(chart.avg_price),
  };
};

export default {
  createChart,
  getCharts,
  getChartsFiltered,
  deleteChart,
  updateChart,
};
