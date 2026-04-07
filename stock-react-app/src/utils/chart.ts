export interface Chart {
  user_id?: string;
  stock_id?: string;
  quantity?: number;
  avg_price?: number;
  percentage_change?: number;
  close?: number | null;
}

export async function fetchChart(user_id: string): Promise<Chart[]> {
  const responseChart = await fetch(
    `http://localhost:3000/api/charts/filter?user_id=${user_id}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  console.log('Fetch Chart response:', responseChart);

  const dataChart = await responseChart.json();
  if (!responseChart.ok) {
    console.error('Failed to fetch Chart', dataChart);
    throw new Error('Failed to fetch Chart');
  }

  const responseStocksPrices = await fetch(
    'http://localhost:3000/api/stock-prices',
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  console.log('Fetch stocks prices response:', responseStocksPrices);

  const dataStockPrices = await responseStocksPrices.json();
  if (!responseStocksPrices.ok) {
    console.error('Failed to fetch stocks prices', dataStockPrices);
    throw new Error('Failed to fetch stocks prices');
  }

  const data = dataChart.map((chart: Chart) => {
    const pricesInfo = dataStockPrices.filter(
      (price: { stock_id: string }) => price.stock_id === chart.stock_id,
    );
    pricesInfo.sort(
      (a: { price_time: string }, b: { price_time: string }) =>
        new Date(b.price_time).getTime() - new Date(a.price_time).getTime(),
    );
    const lastPriceInfo = pricesInfo.length > 0 ? pricesInfo[0] : null;
    const beforeLastPriceInfo = pricesInfo.length > 1 ? pricesInfo[1] : null;
    const percentageChange =
      lastPriceInfo && beforeLastPriceInfo
        ? ((lastPriceInfo.close - beforeLastPriceInfo.close) /
            beforeLastPriceInfo.close) *
          100
        : 0;
    return {
      ...chart,
      percentage_change: percentageChange,
      close: lastPriceInfo ? lastPriceInfo.close : null,
    };
  });

  return data;
}
