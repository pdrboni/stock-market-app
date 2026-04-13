import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../hooks';
import { selectPinnedStocks } from '../features/stocks/stocksSlice';

const c = {
  panel2: '#111d2f',
  lineSoft: 'rgba(48, 68, 94, 0.62)',
  text2: '#d7dee7',
  text4: '#8fa1b7',
  up: '#3ca56f',
  down: '#bf5f5f',
};

export default function PinnedAssets() {
  const pinnedStocks = useAppSelector(selectPinnedStocks);

  return (
    <Box
      sx={{
        borderTop: '1px solid rgba(48,68,94,0.52)',
        pt: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1,
        overflow: 'auto',
        minHeight: 0,
      }}
    >
      <Typography sx={{ fontSize: 11, color: c.text4, flexShrink: 0 }}>
        Pinned Assets
      </Typography>
      {pinnedStocks.map((stock) => {
        const change = `${stock.percentage_change >= 0 ? '+' : ''}${stock.percentage_change.toFixed(2)}%`;
        return (
          <Box
            key={stock.id}
            sx={{
              height: 30,
              border: `1px solid ${c.lineSoft}`,
              borderRadius: '8px',
              bgcolor: c.panel2,
              px: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: c.text2,
              flexShrink: 0,
            }}
          >
            <span>{stock.symbol}</span>
            <Box
              component="span"
              sx={{ color: stock.percentage_change >= 0 ? c.up : c.down }}
            >
              {change}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
