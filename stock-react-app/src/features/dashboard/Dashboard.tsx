import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import RightPanel from '../../components/RightPanel';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import type { FC, JSX } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  InputBase,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router';
import { setLoginFailure, selectUser } from '../auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchStocks, Stock } from '../../utils/stocks';
import {
  selectPinnedStocks,
  selectSelectedStock,
  setPinnedStocks,
  setSelectedStock,
} from '../stocks/stocksSlice';
import { Chart, fetchChart } from '../../utils/chart';

// ── Design tokens ─────────────────────────────────────────────────────────────

const c = {
  bg: '#0b1524',
  panel: '#0f1b2b',
  panel2: '#111d2f',
  line: '#30445e',
  lineSoft: 'rgba(48, 68, 94, 0.62)',
  text: '#f2f5f8',
  text2: '#d7dee7',
  text3: '#b4c0cf',
  text4: '#8fa1b7',
  action: '#234467',
  actionEdge: '#2f5a86',
  up: '#3ca56f',
  down: '#bf5f5f',
};

// ── Static data ───────────────────────────────────────────────────────────────

const TICKERS = [
  { label: 'IBOV', value: '129,881', change: '+0.62%', up: true },
  { label: 'USD/BRL', value: '4.9283', change: '-0.23%', up: false },
  { label: 'IFIX', value: '3,289', change: '+0.18%', up: true },
  { label: 'DI1F27', value: '10.41%', change: '+0.01pp', up: true },
];


const PINNED_ASSETS = [
  { ticker: 'PETR4', change: '+1.40%', up: true },
  { ticker: 'VALE3', change: '-0.72%', up: false },
  { ticker: 'ITUB4', change: '+0.44%', up: true },
  { ticker: 'BBDC4', change: '-0.31%', up: false },
  { ticker: 'WEGE3', change: '+0.89%', up: true },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function valueColor(val: string) {
  if (val.startsWith('+')) return c.up;
  if (val.startsWith('-')) return c.down;
  return 'white';
}

// ── Shared sx ─────────────────────────────────────────────────────────────────

const thCellSx = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.02em',
  color: c.text4,
  borderBottom: '1px solid rgba(48,68,94,0.5)',
  bgcolor: 'rgba(17,29,47)',
  py: '6px',
  px: '8px',
  whiteSpace: 'nowrap' as const,
};

const tdCellSx = {
  fontSize: 12,
  borderBottom: '1px solid rgba(48,68,94,0.26)',
  py: '4px',
  px: '8px',
  whiteSpace: 'nowrap' as const,
};

// ── Sub-components ────────────────────────────────────────────────────────────

// DashboardTopBar interface
interface DashboardTopBarProps {
  isCompact: boolean;
}

const DashboardTopBar: FC<DashboardTopBarProps> = (props): JSX.Element => {
  return (
    <Box
      component="header"
      sx={{
        height: !props.isCompact ? 54 : 108,
        borderBottom: `1px solid ${c.lineSoft}`,
        bgcolor: 'rgba(17,29,47,0.92)',
        display: !props.isCompact ? 'grid' : 'flex',
        flexDirection: !props.isCompact ? 'row' : 'column',
        gridTemplateColumns: { xs: '1fr', md: '220px 1fr 520px' },
        alignItems: 'center',
        gap: '10px',
        px: '10px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: '"Manrope", sans-serif',
          fontWeight: 700,
          fontSize: 16,
          color: c.text,
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 14,
            height: 14,
            border: '1px solid #3a5270',
            borderRadius: '4px',
            bgcolor: '#1a2940',
            flexShrink: 0,
          }}
        />
        MoneyBuilder Broker
      </Box>

      {/* Market tickers — hidden on mobile */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: c.text3,
          whiteSpace: 'nowrap',
        }}
      >
        {TICKERS.map(({ label, value, change, up }) => (
          <Typography
            key={label}
            component="span"
            sx={{ fontSize: 12, color: c.text3 }}
          >
            <Box
              component="strong"
              sx={{ color: c.text2, fontWeight: 600, mr: '4px' }}
            >
              {label}
            </Box>
            {value}{' '}
            <Box component="span" sx={{ color: up ? c.up : c.down }}>
              {change}
            </Box>
          </Typography>
        ))}
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Select
          defaultValue="prime"
          size="small"
          sx={{
            height: 32,
            fontSize: 12,
            color: c.text3,
            bgcolor: '#1a2940',
            borderRadius: '7px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(58,82,112,0.76)',
            },
            '& .MuiSelect-select': { py: '5px', fontSize: 12 },
            '& .MuiSvgIcon-root': { color: c.text3 },
          }}
        >
          <MenuItem value="prime" sx={{ fontSize: 12 }}>
            Conta: Prime
          </MenuItem>
        </Select>

        <InputBase
          placeholder="Buscar ativo ou ticker..."
          sx={{
            height: 32,
            width: 170,
            px: '10px',
            fontSize: 12,
            color: c.text3,
            bgcolor: '#1a2940',
            border: '1px solid rgba(58,82,112,0.76)',
            borderRadius: '7px',
            '& input::placeholder': { color: c.text4, opacity: 1 },
          }}
        />

        <Button
          variant="contained"
          size="small"
          sx={{
            height: 32,
            bgcolor: c.action,
            border: `1px solid ${c.actionEdge}`,
            borderRadius: '7px',
            fontSize: 12,
            fontWeight: 600,
            color: c.text,
            textTransform: 'none',
            boxShadow: 'none',
            px: '12px',
            '&:hover': { bgcolor: '#285079', boxShadow: 'none' },
          }}
        >
          New Order
        </Button>

        {['Session: Open'].map((label) => (
          <Box
            key={label}
            sx={{
              height: 32,
              px: '10px',
              border: '1px solid rgba(58,82,112,0.76)',
              bgcolor: '#1a2940',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 12,
              color: c.text3,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

function SectionHead({ title, controls }: { title: string; controls: string }) {
  return (
    <Box
      sx={{
        height: 34,
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '8px',
        bgcolor: c.panel2,
        px: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <Typography
        component="strong"
        sx={{
          color: c.text2,
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </Typography>
      <Typography component="span" sx={{ fontSize: 12, color: c.text3 }}>
        {controls}
      </Typography>
    </Box>
  );
}

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return vol.toString();
}

function DataTable({
  columns,
  rows,
  onRowClick,
  selectedId,
}: {
  columns: string[];
  rows: Stock[];
  onRowClick?: (stock: Stock) => void;
  selectedId?: string;
}) {
  const dispatch = useAppDispatch();
  const pinnedStocks = useAppSelector(selectPinnedStocks);
  const pinnedIds = new Set(pinnedStocks.map((s) => s.id));

  function togglePin(stock: Stock) {
    const isPinned = pinnedIds.has(stock.id);
    dispatch(
      setPinnedStocks(
        isPinned
          ? pinnedStocks.filter((s) => s.id !== stock.id)
          : [...pinnedStocks, stock],
      ),
    );
  }

  return (
    <Box
      sx={{
        mt: '8px',
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '8px',
        overflow: 'hidden',
        bgcolor: c.panel2,
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} sx={thCellSx}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((stock) => {
              const dayChange = `${Number(stock.percentage_change) >= 0 ? '+' : ''}${Number(stock.percentage_change).toFixed(2)}%`;
              return (
                <TableRow
                  key={stock.id}
                  onClick={() => onRowClick?.(stock)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    bgcolor:
                      selectedId === stock.id
                        ? 'rgba(26,41,64,0.6)'
                        : 'transparent',
                    '&:hover': { bgcolor: 'rgba(26,41,64,0.36)' },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  <TableCell
                    sx={{ ...tdCellSx, color: c.text, fontWeight: 600 }}
                  >
                    {stock.symbol}
                  </TableCell>
                  <TableCell sx={{ ...tdCellSx, color: c.text2 }}>
                    {stock.current_price.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ ...tdCellSx, color: valueColor(dayChange) }}>
                    {dayChange}
                  </TableCell>
                  <TableCell sx={{ ...tdCellSx, color: c.text2 }}>
                    {formatVolume(stock.current_volume)}
                  </TableCell>
                  <TableCell sx={{ ...tdCellSx, p: '2px 4px' }}>
                    <IconButton
                      size="small"
                      onClick={() => togglePin(stock)}
                      sx={{
                        color: pinnedIds.has(stock.id) ? '#f0c040' : c.text4,
                        '&:hover': { color: '#f0c040' },
                        p: '4px',
                      }}
                    >
                      {pinnedIds.has(stock.id) ? (
                        <PushPinIcon sx={{ fontSize: 14 }} />
                      ) : (
                        <PushPinOutlinedIcon sx={{ fontSize: 14 }} />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function StringDataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <Box
      sx={{
        mt: '8px',
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '8px',
        overflow: 'hidden',
        bgcolor: c.panel2,
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} sx={thCellSx}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={i}
                sx={{
                  '&:hover': { bgcolor: 'rgba(26,41,64,0.36)' },
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                {row.map((cell, j) => (
                  <TableCell
                    key={j}
                    sx={{
                      ...tdCellSx,
                      color: j === 0 ? c.text : valueColor(cell),
                      fontWeight: j === 0 ? 600 : 400,
                    }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const POSITIONS_COLS = [
  'Asset',
  'Qty',
  'Avg Price',
  'Last',
  'Day',
  'Allocation',
];

function PositionsTable({
  chart,
  stocks,
}: {
  chart: Chart[];
  stocks: Stock[];
}) {
  const stockMap = new Map(stocks.map((s) => [s.id, s.symbol]));

  const totalAllocated = chart.reduce((sum, item) => {
    return sum + (item.quantity ?? 0) * (item.close ?? 0);
  }, 0);

  return (
    <Box
      sx={{
        mt: '8px',
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '8px',
        overflow: 'hidden',
        bgcolor: c.panel2,
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {POSITIONS_COLS.map((col) => (
                <TableCell key={col} sx={thCellSx}>
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {chart.map((item) => {
              const symbol =
                stockMap.get(item.stock_id ?? '') ?? item.stock_id ?? '—';
              const qty = item.quantity ?? 0;
              const avgPrice = item.avg_price ?? 0;
              const close = item.close ?? null;
              const pctChange = item.percentage_change ?? 0;
              const allocated = qty * (close ?? 0);
              const allocation =
                totalAllocated > 0 ? (allocated / totalAllocated) * 100 : 0;
              const dayStr = `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(2)}%`;

              return (
                <TableRow
                  key={item.stock_id}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(26,41,64,0.36)' },
                    '&:last-child td': { borderBottom: 0 },
                  }}
                >
                  <TableCell
                    sx={{ ...tdCellSx, color: c.text, fontWeight: 600 }}
                  >
                    {symbol}
                  </TableCell>
                  <TableCell sx={{ ...tdCellSx, color: c.text2 }}>
                    {qty.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ ...tdCellSx, color: c.text2 }}>
                    {avgPrice.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ ...tdCellSx, color: c.text2 }}>
                    {close !== null ? close.toFixed(2) : '—'}
                  </TableCell>
                  <TableCell sx={{ ...tdCellSx, color: valueColor(dayStr) }}>
                    {dayStr}
                  </TableCell>
                  <TableCell sx={{ ...tdCellSx, color: c.text2 }}>
                    {allocation.toFixed(1)}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function MainPanel() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [chart, setChart] = useState<Chart[]>([]);
  const user = useAppSelector(selectUser);
  const selectedStock = useAppSelector(selectSelectedStock);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const WATCHLIST_COLS = ['Ticker', 'Last Price', 'Day', 'Vol', 'Pin'];

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const data = await fetchStocks();
        setStocks(data);
        if (data.length > 0) dispatch(setSelectedStock(data[0]));
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    const fetchChartData = async () => {
      try {
        const data = await fetchChart(user.id);
        setChart(data);
        console.log('Fetched chart data:', data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
    fetchChartData();
  }, []);

  return (
    <Paper
      component="main"
      elevation={0}
      sx={{
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '12px',
        bgcolor: c.panel,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Asset strip */}
      <Box
        sx={{
          height: 56,
          borderBottom: `1px solid ${c.lineSoft}`,
          px: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography
            component="h2"
            sx={{
              m: 0,
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 700,
              fontSize: 18,
              color: c.text,
            }}
          >
            {selectedStock ? selectedStock.symbol : '—'}
          </Typography>
          <Typography sx={{ mt: '3px', color: c.text4, fontSize: 12 }}>
            {selectedStock
              ? `${selectedStock.name} · Selected Asset · Last ${selectedStock.current_price.toFixed(2)} · Day ${Number(selectedStock.percentage_change) >= 0 ? '+' : ''}${Number(selectedStock.percentage_change).toFixed(2)}% · Volume ${formatVolume(selectedStock.current_volume)}`
              : 'Select a stock from the watchlist'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {[
            {
              label: 'Analyze',
              color: c.text2,
              border: 'rgba(58,82,112,0.72)',
            },
            { label: 'Buy', color: '#c9f2dc', border: 'rgba(60,165,111,0.5)' },
            { label: 'Sell', color: '#efc3c3', border: 'rgba(191,95,95,0.5)' },
          ].map(({ label, color, border }) => (
            <Box
              key={label}
              component="button"
              onClick={() => navigate('/book')}
              sx={{
                height: 30,
                borderRadius: '7px',
                border: `1px solid ${border}`,
                bgcolor: '#1a2940',
                color,
                px: '12px',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: '"IBM Plex Sans", sans-serif',
                cursor: 'pointer',
                '&:hover': { opacity: 0.85 },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Watchlist */}
      <Box
        sx={{
          flex: 1,
          p: '10px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <SectionHead title="Watchlist" controls="Filter | Sort | Dense" />
        <DataTable
          columns={WATCHLIST_COLS}
          rows={stocks}
          onRowClick={(stock) => dispatch(setSelectedStock(stock))}
          selectedId={selectedStock?.id}
        />
      </Box>

      {/* Positions */}
      <Box
        sx={{
          flex: 1,
          p: '10px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          borderTop: `1px solid ${c.lineSoft}`,
        }}
      >
        <SectionHead title="Portfolio Positions" controls="Allocation View" />
        <PositionsTable chart={chart} stocks={stocks} />
      </Box>
    </Paper>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const isCompact = useMediaQuery('(max-width: 1316px)');
  const isMoreCompact = useMediaQuery('(max-width: 900px)');
  const [rightOpen, setRightOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loginSuccess = useAppSelector((state) => state.auth.loginSuccess);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginSuccess) navigate('/login');
  }, []);

  useEffect(() => {
    if (!isCompact) setRightOpen(false);
  }, [isCompact]);

  useEffect(() => {
    if (!isMoreCompact) setSidebarOpen(false);
  }, [isMoreCompact]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'grid',
        gridTemplateRows: '54px 1fr',
        bgcolor: c.bg,
        color: c.text,
        fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <DashboardTopBar isCompact={isCompact} />

      {/*
       * 12-column grid (desktop) / 4-column grid (mobile)
       * Sidebar    → md: 2 cols  |  xs: 4 cols (full width)
       * MainPanel  → md: 7 cols (normal) / 10 cols (compact)  |  xs: 4 cols
       * RightPanel → md: 3 cols (normal) / toggle overlay (compact ≤ 1316px)
       */}

      {isCompact && <div style={{ height: '2rem' }}></div>}

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          p: '2rem',
          overflow: 'scroll',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Grid
          container
          columns={{ xs: 4, md: 12 }}
          spacing={1.25}
          alignItems="stretch"
          sx={{ height: '100%' }}
        >
          {!isMoreCompact && (
            <Grid size={{ xs: 4, md: 2 }} sx={{ minHeight: 0, height: '100%' }}>
              <Sidebar />
            </Grid>
          )}
          <Grid
            size={{ xs: 4, md: isMoreCompact ? 12 : isCompact ? 10 : 7 }}
            sx={{ minHeight: 0, height: '100%' }}
          >
            <MainPanel />
          </Grid>
          {!isCompact && (
            <Grid size={{ xs: 4, md: 3 }} sx={{ minHeight: 0, height: '100%' }}>
              <RightPanel />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* ── More-compact mode: Sidebar floating toggle + slide-in panel ── */}
      {isMoreCompact && (
        <>
          {/* Backdrop */}
          <Box
            onClick={() => setSidebarOpen(false)}
            sx={{
              position: 'fixed',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 50,
              opacity: sidebarOpen ? 1 : 0,
              pointerEvents: sidebarOpen ? 'auto' : 'none',
              transition: 'opacity 220ms ease',
            }}
          />

          {/* Slide-in panel (left) */}
          <Box
            sx={{
              position: 'fixed',
              top: 54,
              left: 0,
              bottom: 0,
              width: 240,
              zIndex: 60,
              p: '10px',
              boxSizing: 'border-box',
              transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <Sidebar />
          </Box>

          {/* Toggle button (top-left) */}
          <IconButton
            aria-label={
              sidebarOpen ? 'Fechar menu lateral' : 'Abrir menu lateral'
            }
            onClick={() => setSidebarOpen((prev) => !prev)}
            sx={{
              position: 'fixed',
              top: 66,
              left: 12,
              zIndex: 70,
              width: 40,
              height: 40,
              bgcolor: sidebarOpen ? c.action : c.panel2,
              border: `1px solid ${sidebarOpen ? c.actionEdge : c.lineSoft}`,
              borderRadius: '10px',
              color: c.text2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
              transition:
                'background-color 150ms ease, border-color 150ms ease',
              '&:hover': { bgcolor: c.action, borderColor: c.actionEdge },
            }}
          >
            {sidebarOpen ? (
              /* X / fechar */
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              /* Ícone de hamburger / menu */
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                <line
                  x1="0"
                  y1="1"
                  x2="16"
                  y2="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="0"
                  y1="7"
                  x2="16"
                  y2="7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="0"
                  y1="13"
                  x2="16"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </IconButton>
        </>
      )}

      <Snackbar
        open={loginSuccess}
        autoHideDuration={4000}
        onClose={() => dispatch(setLoginFailure())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => dispatch(setLoginFailure())}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Logged in successfully!
        </Alert>
      </Snackbar>

      {/* ── Compact mode: floating toggle + slide-in panel ── */}
      {isCompact && (
        <>
          {/* Backdrop */}
          <Box
            onClick={() => setRightOpen(false)}
            sx={{
              position: 'fixed',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 50,
              opacity: rightOpen ? 1 : 0,
              pointerEvents: rightOpen ? 'auto' : 'none',
              transition: 'opacity 220ms ease',
            }}
          />

          {/* Slide-in panel */}
          <Box
            sx={{
              position: 'fixed',
              top: 54,
              right: 0,
              bottom: 0,
              width: 300,
              zIndex: 60,
              p: '10px',
              boxSizing: 'border-box',
              transform: rightOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <RightPanel />
          </Box>

          {/* Toggle button */}
          <IconButton
            aria-label={
              rightOpen ? 'Fechar painel direito' : 'Abrir painel direito'
            }
            onClick={() => setRightOpen((prev) => !prev)}
            sx={{
              position: 'fixed',
              top: 66,
              right: 12,
              zIndex: 70,
              width: 40,
              height: 40,
              bgcolor: rightOpen ? c.action : c.panel2,
              border: `1px solid ${rightOpen ? c.actionEdge : c.lineSoft}`,
              borderRadius: '10px',
              color: c.text2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
              transition:
                'background-color 150ms ease, border-color 150ms ease',
              '&:hover': { bgcolor: c.action, borderColor: c.actionEdge },
            }}
          >
            {rightOpen ? (
              /* X / fechar */
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              /* Ícone de painel lateral */
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="14"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <line
                  x1="10.5"
                  y1="1"
                  x2="10.5"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </IconButton>
        </>
      )}
    </Box>
  );
}
