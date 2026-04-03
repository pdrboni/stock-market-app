export interface Stock {
  id: string;
  symbol: string;
  name: string;
  exchange?: string;
  currency: string;
  sector: string;
  current_price: number;
  current_volume: number;
  updated_at: string;
  percentage_change?: number;
  price?: number;
  change?: number;
  volume?: number;
}

export async function fetchStocks(): Promise<Stock[]> {
  const responseStocks = await fetch('http://localhost:3000/api/stocks', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Fetch stocks response:', responseStocks);

  const dataStocks = await responseStocks.json();
  if (!responseStocks.ok) {
    console.error('Failed to fetch stocks', dataStocks);
    throw new Error('Failed to fetch stocks');
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

  const dataPrices = await responseStocksPrices.json();
  if (!responseStocksPrices.ok) {
    console.error('Failed to fetch stocks prices', dataPrices);
    throw new Error('Failed to fetch stocks prices');
  }

  const data = dataStocks.map((stock: Stock) => {
    const pricesInfo = dataPrices.filter(
      (price: { stock_id: string }) => price.stock_id === stock.id,
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
      ...stock,
      percentage_change: percentageChange,
    };
  });

  return data;
}
