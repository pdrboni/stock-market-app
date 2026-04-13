import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  InputBase,
  Select,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectUser, setUser } from '../auth/authSlice';
import Sidebar from '../../components/Sidebar';
import RightPanel from '../../components/RightPanel';
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
];

const HEAD_COLS = ['Asset', 'Qty', 'Avg Price', 'Last', 'Day %', 'Allocation'];
const COL_TEMPLATE = '1.2fr 0.8fr 0.8fr 0.8fr 0.9fr 1fr';

// ── Component ─────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const user = useAppSelector(selectUser);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<
    'deposit' | 'withdraw' | null
  >(null);
  const [actionAmount, setActionAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('bb');
  const isMobile = useMediaQuery('(max-width:900px)');
  const dispatch = useAppDispatch();

  async function deposit() {
    await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        price: actionAmount,
        quantity: 0,
        type: 'DEPOSIT',
      }),
    });

    dispatch(
      setUser({
        ...user,
        available_cash:
          (user.available_cash || 0) +
          (typeof Number(actionAmount) === 'number' ? Number(actionAmount) : 0),
      }),
    );
  }

  async function withdraw() {
    await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        price: actionAmount,
        quantity: 0,
        type: 'WITHDRAWAL',
      }),
    });

    dispatch(
      setUser({
        ...user,
        available_cash:
          (user.available_cash || 0) -
          (typeof Number(actionAmount) === 'number' ? Number(actionAmount) : 0),
      }),
    );
  }

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (user.id) {
      fetchChart(user.id).then(setCharts).catch(console.error);
    }
  }, [user.id]);

  const totalAllocated = charts.reduce((sum, row) => {
    return sum + (row.quantity ?? 0) * (row.close ?? row.avg_price ?? 0);
  }, 0);

  const allocItems = Object.entries(
    charts.reduce<Record<string, number>>((acc, row) => {
      const sector = row.stock_info?.sector ?? 'Other';
      const value = (row.quantity ?? 0) * (row.close ?? row.avg_price ?? 0);
      acc[sector] = (acc[sector] ?? 0) + value;
      return acc;
    }, {}),
  )
    .map(([label, value]) => ({
      label,
      pct: totalAllocated > 0 ? Math.round((value / totalAllocated) * 100) : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateRows: '54px 1fr',
        bgcolor: c.bg,
        color: c.text,
        fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Topbar ─────────────────────────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          zIndex: 2,
          height: 54,
          borderBottom: `1px solid ${c.lineSoft}`,
          bgcolor: 'rgba(17,29,47,0.92)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '14px',
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: 16,
            fontWeight: 650,
            letterSpacing: '0.01em',
            color: c.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Box
            component="span"
            sx={{
              width: 14,
              height: 14,
              border: '1px solid #3a5270',
              bgcolor: '#1a2940',
              borderRadius: '4px',
              flexShrink: 0,
            }}
          />
          MoneyBuilder Broker
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {!isMobile &&
            TICKERS.map((t) => (
              <Typography
                key={t.label}
                sx={{ fontSize: 12, color: c.text3, whiteSpace: 'nowrap' }}
              >
                <Box
                  component="strong"
                  sx={{ color: c.text2, fontWeight: 600, mr: '4px' }}
                >
                  {t.label}
                </Box>
                {t.value}{' '}
                <Box component="span" sx={{ color: t.up ? c.up : c.down }}>
                  {t.change}
                </Box>
              </Typography>
            ))}
          {[{ label: 'Conta: Prime' }, { label: 'Session: Open' }].map(
            (chip) => (
              <Box
                key={chip.label}
                sx={{
                  border: `1px solid ${c.line}`,
                  bgcolor: '#1a2940',
                  borderRadius: '7px',
                  color: c.text3,
                  px: '8px',
                  py: '5px',
                  fontSize: 11,
                }}
              >
                {chip.label}
              </Box>
            ),
          )}
        </Box>
      </Box>

      {/* ── Workspace ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '218px 1fr 324px',
          gap: '10px',
          p: '10px',
          minHeight: 'calc(100vh - 54px)',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar reutilizável (desktop) */}
        {!isMobile && <Sidebar />}

        {/* Sidebar mobile: backdrop + slide-in + botão flutuante */}
        {isMobile && (
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

            {/* Slide-in panel */}
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

            {/* Botão flutuante toggle */}
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
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1L13 13M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
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

        {/* ── Main center panel ──────────────────────────────────────────── */}
        <Paper
          component="main"
          elevation={0}
          sx={{
            border: `1px solid ${c.lineSoft}`,
            borderRadius: '12px',
            bgcolor: c.panel,
            display: 'grid',
            gridTemplateRows: 'auto auto 1fr',
            overflow: 'hidden',
          }}
        >
          {/* Portfolio header */}
          <Box
            sx={{
              borderBottom: `1px solid ${c.lineSoft}`,
              p: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 20,
                  fontWeight: 650,
                  letterSpacing: '-0.01em',
                  color: c.text,
                  m: 0,
                }}
              >
                Portfolio
              </Typography>
              <Typography sx={{ fontSize: 12, color: c.text4, mt: '3px' }}>
                Benchmark: IBOV +0.62%
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['deposit', 'withdraw'] as const).map((action) => {
                const label = action === 'deposit' ? 'Deposit' : 'Withdraw';
                const isActive = activeAction === action;
                return (
                  <Button
                    key={action}
                    size="small"
                    onClick={() => setActiveAction(isActive ? null : action)}
                    sx={{
                      height: 32,
                      borderRadius: '7px',
                      px: '12px',
                      border: isActive
                        ? `1px solid ${c.actionEdge}`
                        : '1px solid rgba(58,82,112,0.75)',
                      bgcolor: isActive ? c.action : '#1a2940',
                      color: isActive ? c.text : c.text2,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'none',
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      '&:hover': { borderColor: '#5d84af', color: c.text },
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </Box>
          </Box>

          {/* Summary metrics */}
          <Box
            sx={{
              p: '10px',
              borderBottom: `1px solid ${c.lineSoft}`,
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : '1.25fr 1fr 2fr',
              gap: '8px',
            }}
          >
            {/* Total Equity */}
            <Box
              sx={{
                border: '1px solid rgba(48,68,94,0.58)',
                bgcolor: c.panel2,
                borderRadius: '8px',
                p: '8px 10px',
                minHeight: 58,
                display: 'grid',
                gap: '4px',
              }}
            >
              <Typography
                sx={{ color: c.text4, fontSize: 11, letterSpacing: '0.02em' }}
              >
                Total Equity
              </Typography>
              <Typography
                sx={{
                  color: c.text,
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                R$ 722,430
              </Typography>
              <Typography sx={{ fontSize: 11, color: c.text3 }}>
                <Box component="span" sx={{ color: c.up }}>
                  +0.38%{' '}
                </Box>
                vs benchmark
              </Typography>
            </Box>

            {/* Available Cash */}
            <Box
              sx={{
                border: '1px solid rgba(48,68,94,0.58)',
                bgcolor: c.panel2,
                borderRadius: '8px',
                p: '8px 10px',
                minHeight: 58,
                display: 'grid',
                gap: '4px',
              }}
            >
              <Typography
                sx={{ color: c.text4, fontSize: 11, letterSpacing: '0.02em' }}
              >
                Available Cash
              </Typography>
              <Typography
                sx={{
                  color: c.text,
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}
              >
                {user.available_cash !== undefined
                  ? `R$ ${user.available_cash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : '...'}
              </Typography>
              <Typography sx={{ fontSize: 11, color: c.text3 }}>
                Saldo disponível
              </Typography>
            </Box>

            {/* Action card — Deposit / Withdraw (span 2 colunas) */}
            <Box
              sx={{
                border: '1px solid rgba(48,68,94,0.58)',
                bgcolor: c.panel2,
                borderRadius: '8px',
                p: '8px 10px',
                minHeight: 58,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '8px',
                gridColumn: isMobile ? 'span 2' : 'auto',
              }}
            >
              {activeAction === null && (
                <Typography sx={{ fontSize: 12, color: c.text4 }}>
                  Selecione Deposit ou Withdraw para continuar.
                </Typography>
              )}

              {activeAction !== null && (
                <>
                  <Typography
                    sx={{
                      color: c.text4,
                      fontSize: 11,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {activeAction === 'deposit' ? 'Deposit' : 'Withdraw'}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Input de valor */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid rgba(58,82,112,0.76)',
                        bgcolor: '#1a2940',
                        borderRadius: '7px',
                        px: '10px',
                        height: 32,
                        flex: '1 1 120px',
                        minWidth: 120,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 12, color: c.text4, flexShrink: 0 }}
                      >
                        R$
                      </Typography>
                      <InputBase
                        placeholder="0,00"
                        value={actionAmount}
                        onChange={(e) => setActionAmount(e.target.value)}
                        inputProps={{ inputMode: 'decimal' }}
                        sx={{
                          fontSize: 12,
                          color: c.text,
                          flex: 1,
                          '& input::placeholder': {
                            color: c.text4,
                            opacity: 1,
                          },
                        }}
                      />
                    </Box>

                    {/* Select de conta bancária (apenas para Withdraw) */}
                    {activeAction === 'withdraw' && (
                      <Select
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        size="small"
                        sx={{
                          height: 32,
                          fontSize: 12,
                          color: c.text3,
                          bgcolor: '#1a2940',
                          borderRadius: '7px',
                          flex: '1 1 180px',
                          minWidth: 180,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(58,82,112,0.76)',
                          },
                          '& .MuiSelect-select': { py: '5px', fontSize: 12 },
                          '& .MuiSvgIcon-root': { color: c.text3 },
                        }}
                      >
                        <MenuItem value="bb" sx={{ fontSize: 12 }}>
                          Banco do Brasil – Ag. 1234 / CC 56789-0
                        </MenuItem>
                        <MenuItem value="nu" sx={{ fontSize: 12 }}>
                          Nubank – Ag. 0001 / CC 12345-6
                        </MenuItem>
                      </Select>
                    )}

                    {/* Submit */}
                    <Button
                      size="small"
                      onClick={activeAction === 'deposit' ? deposit : withdraw}
                      sx={{
                        height: 32,
                        borderRadius: '7px',
                        px: '14px',
                        border: `1px solid ${c.actionEdge}`,
                        bgcolor: c.action,
                        color: c.text,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontFamily: '"IBM Plex Sans", sans-serif',
                        flexShrink: 0,
                        '&:hover': {
                          borderColor: '#5d84af',
                          bgcolor: '#285079',
                        },
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          {/* Analysis + Holdings */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
              minHeight: 0,
            }}
          >
            {/* Analysis top */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                borderBottom: `1px solid ${c.lineSoft}`,
                height: '100%',
                minHeight: 0,
              }}
            >
              {/* Performance chart placeholder */}
              <Box sx={{ p: '10px', minHeight: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: '8px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: c.text2,
                      letterSpacing: '0.01em',
                    }}
                  >
                    Performance vs Benchmark
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '4px' }}>
                    {['1D', '1W', '1M', 'YTD'].map((r, i) => (
                      <Box
                        key={r}
                        component="button"
                        sx={{
                          width: 30,
                          height: 22,
                          borderRadius: '6px',
                          border: `1px solid ${i === 2 ? '#5d84af' : 'rgba(58,82,112,0.7)'}`,
                          bgcolor: '#1a2940',
                          color: i === 2 ? c.text2 : c.text4,
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: '"IBM Plex Sans", sans-serif',
                        }}
                      >
                        {r}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: '80%',
                    border: '1px solid rgba(48,68,94,0.55)',
                    borderRadius: '8px',
                    bgcolor: c.panel2,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundImage:
                      'linear-gradient(rgba(48,68,94,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(48,68,94,0.18) 1px, transparent 1px)',
                    backgroundSize: '100% 26px, 52px 100%',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(179deg, transparent 35%, rgba(60,165,111,0.11) 36%, rgba(60,165,111,0.11) 62%, transparent 63%)',
                      opacity: 0.9,
                    }}
                  />
                </Box>
              </Box>

              {/* Allocation */}
              <Box
                sx={{
                  p: '10px',
                  borderLeft: '1px solid rgba(48,68,94,0.55)',
                  bgcolor: c.panel2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: '8px',
                  }}
                >
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 600, color: c.text2 }}
                  >
                    Allocation
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: c.text4 }}>
                    Asset Class
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gap: '8px' }}>
                  {allocItems.map((a) => (
                    <Box
                      key={a.label}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr auto',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Typography sx={{ fontSize: 12, color: c.text3 }}>
                        {a.label}
                      </Typography>
                      <Box
                        sx={{
                          height: 7,
                          borderRadius: '999px',
                          bgcolor: '#2c3f57',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${a.pct}%`,
                            bgcolor: '#5d84af',
                          }}
                        />
                      </Box>
                      <Typography
                        component="strong"
                        sx={{ fontSize: 12, color: c.text2, fontWeight: 600 }}
                      >
                        {a.pct}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Holdings table */}
            <Box
              sx={{
                minHeight: 0,
                display: 'grid',
                gridTemplateRows: '34px 1fr',
                overflow: 'hidden',
              }}
            >
              {/* Table header */}
              <Box
                sx={{
                  borderBottom: `1px solid ${c.lineSoft}`,
                  display: 'grid',
                  gridTemplateColumns: COL_TEMPLATE,
                  alignItems: 'center',
                  px: '10px',
                }}
              >
                {HEAD_COLS.map((h) => (
                  <Typography
                    key={h}
                    sx={{
                      fontSize: 11,
                      color: c.text4,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {h}
                  </Typography>
                ))}
              </Box>

              {/* Table rows */}
              <Box sx={{ overflowY: 'auto', pb: '6px' }}>
                {charts.length === 0 && (
                  <Typography
                    sx={{ fontSize: 12, color: c.text4, p: '12px 10px' }}
                  >
                    No positions found.
                  </Typography>
                )}
                {charts.map((row) => {
                  const lastPrice = row.close ?? row.avg_price ?? 0;
                  const posValue = (row.quantity ?? 0) * lastPrice;
                  const alloc =
                    totalAllocated > 0
                      ? ((posValue / totalAllocated) * 100).toFixed(1)
                      : '0.0';
                  const pctChange = row.percentage_change ?? 0;
                  const isUp = pctChange >= 0;

                  return (
                    <Box
                      key={row.stock_id}
                      sx={{
                        height: 'fit-content',
                        paddingY: '0.6rem',
                        borderBottom: '1px solid rgba(48,68,94,0.34)',
                        display: 'grid',
                        gridTemplateColumns: COL_TEMPLATE,
                        alignItems: 'center',
                        px: '10px',
                        fontSize: 12,
                        color: c.text2,
                        textWrap: 'wrap',
                        '&:hover': { bgcolor: 'rgba(26,41,64,0.45)' },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          color: c.text,
                          fontWeight: 600,
                          wordWrap: 'anywhere',
                        }}
                      >
                        {row.stock_id}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: c.text2 }}>
                        {row.quantity?.toLocaleString('pt-BR') ?? '—'}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: c.text2 }}>
                        {row.avg_price?.toFixed(2) ?? '—'}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: c.text2 }}>
                        {lastPrice > 0 ? lastPrice.toFixed(2) : '—'}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 12, color: isUp ? c.up : c.down }}
                      >
                        {isUp ? '+' : ''}
                        {pctChange.toFixed(2)}%
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: c.text2 }}>
                        {alloc}%
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* ── Utility panel ─────────────────────────────────────────────────── */}
        {!isMobile && <RightPanel />}
      </Box>
    </Box>
  );
}
