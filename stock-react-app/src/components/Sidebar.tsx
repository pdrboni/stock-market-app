import { useLocation, useNavigate } from 'react-router';
import { Box, Paper, Typography } from '@mui/material';
import { useAppSelector } from '../hooks';
import { selectPinnedStocks } from '../features/stocks/stocksSlice';
import { selectUser } from '../features/auth/authSlice';
import PinnedAssets from './PinnedAssets';

const c = {
  panel: '#0f1b2b',
  panel2: '#111d2f',
  lineSoft: 'rgba(48, 68, 94, 0.62)',
  text: '#f2f5f8',
  text2: '#d7dee7',
  text3: '#b4c0cf',
  text4: '#8fa1b7',
};

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'User Profile', path: '/user' },
  { label: 'Portfolio', path: '/portfolio' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pinnedStocks = useAppSelector(selectPinnedStocks);
  const user = useAppSelector(selectUser);

  return (
    <Paper
      component="aside"
      elevation={0}
      sx={{
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '12px',
        bgcolor: c.panel,
        p: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Profile card */}
      <Box
        sx={{
          border: `1px solid ${c.lineSoft}`,
          borderRadius: '8px',
          bgcolor: c.panel2,
          p: '10px',
          fontSize: 12,
          color: c.text3,
          lineHeight: 1.42,
          flexShrink: 0,
        }}
      >
        Investor Profile
        <Typography
          component="strong"
          sx={{
            display: 'block',
            color: c.text2,
            mt: '2px',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Moderate Growth
        </Typography>
        Available Cash:{' '}
        {user.available_cash !== undefined
          ? `R$ ${user.available_cash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          : '...'}
      </Box>

      {/* Nav menu */}
      <Box
        component="nav"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        {NAV_ITEMS.map(({ label, path }) => {
          const isActive = pathname === path;
          return (
            <Box
              key={path}
              component="button"
              onClick={() => navigate(path)}
              sx={{
                height: 34,
                border: isActive ? '1px solid #3a5270' : '1px solid transparent',
                borderRadius: '8px',
                bgcolor: isActive ? '#1a2940' : 'transparent',
                color: isActive ? c.text : c.text3,
                textAlign: 'left',
                px: '10px',
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                fontFamily: '"IBM Plex Sans", sans-serif',
                cursor: 'pointer',
                transition: 'background-color 120ms ease, border-color 120ms ease',
                '&:hover': {
                  bgcolor: isActive ? '#1a2940' : 'rgba(26,41,64,0.4)',
                },
              }}
            >
              {label}
            </Box>
          );
        })}
      </Box>

      {/* Pinned assets */}
      <PinnedAssets />

      {/* Footer */}
      <Typography sx={{ fontSize: 11, color: c.text4, flexShrink: 0 }}>
        Latency 22ms | Feed RT-B3
      </Typography>
    </Paper>
  );
}
