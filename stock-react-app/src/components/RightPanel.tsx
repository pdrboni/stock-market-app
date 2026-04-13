import { Box, Paper, Typography } from '@mui/material';

const c = {
  panel2: '#111d2f',
  lineSoft: 'rgba(48, 68, 94, 0.62)',
  text2: '#d7dee7',
  text3: '#b4c0cf',
  up: '#3ca56f',
  down: '#bf5f5f',
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        border: '1px solid rgba(48,68,94,0.5)',
        bgcolor: c.panel2,
        borderRadius: '8px',
        p: '10px',
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color: c.text2,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          mb: '8px',
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function RightPanel() {
  return (
    <Paper
      component="aside"
      elevation={0}
      sx={{
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '12px',
        bgcolor: 'rgba(15,27,43,0.86)',
        p: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        height: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Watchlist Mini */}
      <Section title="Recommended Stocks">
        <span>aloo</span>
      </Section>
    </Paper>
  );
}
