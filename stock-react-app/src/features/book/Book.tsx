import { useState, useEffect } from 'react';
import type { FC, JSX } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectSelectedStock } from '../stocks/stocksSlice';
import { selectUser, setUser, User } from '../auth/authSlice';
import Sidebar from '../../components/Sidebar';
import RightPanel from '../../components/RightPanel';
import {
  fetchTransactionsForBook,
  Transaction,
} from '../../utils/transactions';

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
  bidText: '#7ed0a1',
  askText: '#d39191',
};

// ── Static data ───────────────────────────────────────────────────────────────

const TICKERS = [
  { label: 'IBOV', value: '129,881', change: '+0.62%', up: true },
  { label: 'USD/BRL', value: '4.9283', change: '-0.23%', up: false },
  { label: 'IFIX', value: '3,289', change: '+0.18%', up: true },
];

const PINNED_TICKERS = [
  { ticker: 'PETR4', change: '+1.40%', up: true },
  { ticker: 'VALE3', change: '-0.72%', up: false },
  { ticker: 'ITUB4', change: '+0.44%', up: true },
  { ticker: 'BBDC4', change: '-0.31%', up: false },
];

// Ask (sell offers) — sorted lowest price first (best ask at bottom, closest to spread)
const ASK_ROWS = [
  { price: '38.50', qty: '830', broker: 'ITAU', orders: 4 },
  { price: '38.49', qty: '860', broker: 'MIRA', orders: 2 },
  { price: '38.48', qty: '970', broker: 'BTGC', orders: 3 },
  { price: '38.47', qty: '1,110', broker: 'RICO', orders: 5 },
  { price: '38.46', qty: '1,420', broker: 'ITAU', orders: 6 },
  { price: '38.45', qty: '1,650', broker: 'GENI', orders: 4 },
  { price: '38.44', qty: '1,800', broker: 'UBSB', orders: 7 },
  { price: '38.43', qty: '2,900', broker: 'XPIN', orders: 9 },
];

// Bid (buy offers) — sorted highest price first (best bid at top, closest to spread)
const BID_ROWS = [
  { price: '38.41', qty: '3,400', broker: 'BRAD', orders: 11 },
  { price: '38.40', qty: '2,100', broker: 'ITAU', orders: 8 },
  { price: '38.39', qty: '1,750', broker: 'BTGC', orders: 6 },
  { price: '38.38', qty: '1,320', broker: 'MIRA', orders: 5 },
  { price: '38.37', qty: '1,080', broker: 'ATLA', orders: 4 },
  { price: '38.36', qty: '920', broker: 'XPIN', orders: 3 },
  { price: '38.35', qty: '810', broker: 'UBSB', orders: 3 },
  { price: '38.34', qty: '760', broker: 'GENI', orders: 2 },
];

const TIME_SALES = [
  { time: '10:42:10 · 38.42', side: 'BUY 2,100', up: true },
  { time: '10:42:08 · 38.41', side: 'SELL 1,400', up: false },
  { time: '10:42:05 · 38.42', side: 'BUY 900', up: true },
];

const QUICK_STRATEGY = [
  { label: 'Qty Presets', value: '500 · 1k · 2k' },
  { label: 'Order Template', value: 'Scalp-Limit' },
  { label: 'Auto Replace', value: 'Enabled', up: true },
];

const ORDERS_COLS = [
  'Order ID',
  'Side',
  'Qty',
  'Price',
  'Status',
  'Timestamp',
  'Actions',
];
const ORDERS_DATA = [
  [
    'ORD-992201',
    'BUY',
    '1,000',
    '38.43',
    'Pending',
    '10:42:14',
    'Modify / Cancel',
  ],
  [
    'ORD-992117',
    'SELL',
    '600',
    '38.46',
    'Partial',
    '10:39:55',
    'Replace / Cancel',
  ],
  ['ORD-992118', 'BUY', '500', '38.44', 'Rejected', '10:38:17', 'Review'],
  ['ORD-992101', 'SELL', '300', '38.47', 'Filled', '10:34:08', 'Details'],
];


// ── Helpers ───────────────────────────────────────────────────────────────────

function statusColor(status: string) {
  if (status === 'Rejected') return c.down;
  if (status === 'Filled') return c.up;
  if (status === 'Partial') return '#e8c76a';
  return c.text3;
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface BookTopBarProps {
  isCompact: boolean;
}

const BookTopBar: FC<BookTopBarProps> = ({ isCompact }): JSX.Element => (
  <Box
    component="header"
    sx={{
      height: !isCompact ? 54 : 108,
      borderBottom: `1px solid ${c.lineSoft}`,
      bgcolor: 'rgba(17,29,47,0.92)',
      display: !isCompact ? 'grid' : 'flex',
      flexDirection: !isCompact ? 'row' : 'column',
      gridTemplateColumns: { xs: '1fr', md: '220px 1fr 260px' },
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

    {/* Market tickers */}
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

    {/* Chips */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {['Conta: Prime', 'Session: Open'].map((label) => (
        <Box
          key={label}
          sx={{
            height: 30,
            px: '10px',
            border: '1px solid rgba(58,82,112,0.76)',
            bgcolor: '#1a2940',
            borderRadius: '7px',
            display: 'flex',
            alignItems: 'center',
            fontSize: 11,
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

// ─────────────────────────────────────────────────────────────────────────────

// Shared columns for each side: Qtd | Usuário | Preço
const BOOK_COLS = ['Qtd', 'User', 'Price'];

function BookSectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        px: '10px',
        height: 26,
        alignItems: 'center',
        bgcolor: 'rgba(17,29,47,0.7)',
        borderBottom: '1px solid rgba(48,68,94,0.4)',
        flexShrink: 0,
      }}
    >
      {BOOK_COLS.map((col, i) => (
        <Typography
          key={col}
          sx={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: i === BOOK_COLS.length - 1 ? color : c.text4,
            textAlign: i === BOOK_COLS.length - 1 ? 'right' : 'left',
          }}
        >
          {col}
        </Typography>
      ))}
    </Box>
  );
}

function BookRow({
  transaction,
  color,
  bgAccent,
}: {
  transaction: Transaction;
  color: string;
  bgAccent: string;
}) {
  const maxQty = 4000;
  const pct = Math.min((transaction.quantity / maxQty) * 100, 100);

  return (
    <Box
      sx={{
        position: 'relative',
        height: 24,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        alignItems: 'center',
        px: '10px',
        fontSize: 12,
        color: c.text2,
        borderBottom: '1px solid rgba(48,68,94,0.18)',
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': { bgcolor: 'rgba(26,41,64,0.45)' },
      }}
    >
      {/* Depth bar */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          bgcolor: bgAccent,
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative' }}>{transaction.quantity}</span>
      <span style={{ position: 'relative', color: c.text3 }}>
        {transaction.user_name || '—'}
      </span>
      <Box
        component="span"
        sx={{
          position: 'relative',
          color,
          fontWeight: 600,
          textAlign: 'right',
        }}
      >
        {transaction.price.toFixed(2)}
      </Box>
    </Box>
  );
}

function OrderBook({ transactions }: { transactions: Transaction[] }) {
  return (
    <Box
      sx={{
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '8px',
        bgcolor: c.panel2,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* ── SELL section ── */}
      <Box
        sx={{
          px: '10px',
          height: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderBottom: '1px solid rgba(48,68,94,0.5)',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.askText }}
        />
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: c.askText,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Sell — Orders
        </Typography>
        <Typography sx={{ fontSize: 10, color: c.text4, ml: 'auto' }}>
          {transactions
            .filter((t) => t.type === 'SELL')
            .reduce((s, t) => s + t.quantity, 0)
            .toLocaleString('pt-BR')}{' '}
          unidades
        </Typography>
      </Box>

      <BookSectionHeader label="Sell" color={c.askText} />

      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {transactions
          .filter((t) => t.type === 'SELL')
          .sort((a, b) => b.price - a.price)
          .map((transaction) => (
            <BookRow
              key={transaction.id}
              transaction={transaction}
              color={c.askText}
              bgAccent="rgba(191,95,95,0.08)"
            />
          ))}
      </Box>

      {/* ── Spread row ── */}
      <Box
        sx={{
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          borderTop: '1px solid rgba(48,68,94,0.5)',
          borderBottom: '1px solid rgba(48,68,94,0.5)',
          bgcolor: '#1a2940',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: 11, color: c.text4 }}>
          Best Bid{' '}
          <Box component="span" sx={{ color: c.bidText, fontWeight: 600 }}>
            {transactions
              .filter((t) => t.type === 'BUY')
              .sort((a, b) => b.price - a.price)[0]
              ?.price.toFixed(2) || '—'}
          </Box>
        </Typography>
        <Typography sx={{ fontSize: 11, color: c.text3 }}>
          Spread{' '}
          <Box component="span" sx={{ color: c.text2, fontWeight: 600 }}>
            0.02
          </Box>
        </Typography>
        <Typography sx={{ fontSize: 11, color: c.text4 }}>
          Best Ask{' '}
          <Box component="span" sx={{ color: c.askText, fontWeight: 600 }}>
            {transactions
              .filter((t) => t.type === 'SELL')
              .sort((a, b) => a.price - b.price)[0]
              ?.price.toFixed(2) || '—'}
          </Box>
        </Typography>
      </Box>

      {/* ── BUY section ── */}
      <Box
        sx={{
          px: '10px',
          height: 30,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderBottom: '1px solid rgba(48,68,94,0.5)',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.bidText }}
        />
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: c.bidText,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Buy — Orders
        </Typography>
        <Typography sx={{ fontSize: 11, color: c.text4, ml: 'auto' }}>
          {transactions
            .filter((t) => t.type === 'BUY')
            .reduce((s, t) => s + t.quantity, 0)
            .toLocaleString('pt-BR')}{' '}
          unidades
        </Typography>
      </Box>

      <BookSectionHeader label="Buy" color={c.bidText} />

      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {transactions
          .filter((t) => t.type === 'BUY')
          .sort((a, b) => b.price - a.price)
          .map((transaction) => (
            <BookRow
              key={transaction.id}
              transaction={transaction}
              color={c.bidText}
              bgAccent="rgba(60,165,111,0.08)"
            />
          ))}
      </Box>
    </Box>
  );
}

interface OrderTicketProps {
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  transactions: Transaction[];
}

const OrderTicket: FC<OrderTicketProps> = ({
  setTransactions,
  transactions,
}): JSX.Element => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const user = useAppSelector(selectUser);
  const selectedStock = useAppSelector(selectSelectedStock);
  const [orderData, setOrderData] = useState<Transaction>({
    user_id: user?.id,
    stock_id: selectedStock?.id,
    price: 0,
    quantity: 0,
    type: 'BUY',
    user_name: user?.name || '',
  } as Transaction);
  const dispatch = useAppDispatch();

  async function checkOrderMatch(
    bookTransactions: Transaction[],
    newTransaction: Transaction,
  ) {
    const deleteOrder = async (id: string) =>
      fetch(`http://localhost:3000/api/transactions`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

    const removeFromSellerPortfolio = async (sellerUserId: string) =>
      fetch(`http://localhost:3000/api/charts`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock_id: newTransaction.stock_id,
          user_id: sellerUserId,
        }),
      });

    const addToBuyerPortfolio = async (
      match: Transaction,
      buyerUserId: string,
    ) =>
      fetch(`http://localhost:3000/api/charts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock_id: newTransaction.stock_id,
          user_id: buyerUserId,
          quantity: newTransaction.quantity,
          avg_price: match.price,
        }),
      });

    const depositToSellerWallet = async (
      sellerUserId: string,
      match: Transaction,
    ) =>
      fetch(`http://localhost:3000/api/transactions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock_id: null,
          user_id: sellerUserId,
          quantity: 0,
          price: match.price * match.quantity,
          type: 'DEPOSIT',
        }),
      });

    const withdrawFromBuyerWallet = async (
      buyerUserId: string,
      match: Transaction,
    ) =>
      fetch(`http://localhost:3000/api/transactions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock_id: null,
          user_id: buyerUserId,
          quantity: 0,
          price: match.price * match.quantity,
          type: 'WITHDRAWAL',
        }),
      });

    const oppositeType = newTransaction.type === 'BUY' ? 'SELL' : 'BUY';

    const candidates = bookTransactions.filter(
      (t) => t.type === oppositeType && t.stock_id === newTransaction.stock_id,
    );

    console.log('Book transactions:', bookTransactions);
    console.log('New transactions:', newTransaction);
    console.log('Candidate opposite orders:', candidates);

    const match =
      newTransaction.type === 'BUY'
        ? candidates.find((t) => t.price <= newTransaction.price)
        : candidates.find((t) => t.price >= newTransaction.price);

    if (match) {
      console.log(
        `[Order Match] ${newTransaction.type} order at R$${newTransaction.price} matched with` +
          ` ${oppositeType} order from ${match.user_name} at R$${match.price} (id: ${match.id})`,
      );

      await deleteOrder(match.id);
      await deleteOrder(newTransaction.id);
      await addToBuyerPortfolio(match, newTransaction.user_id);
      await removeFromSellerPortfolio(match.user_id);
      await depositToSellerWallet(match.user_id, match);
      console.log(newTransaction, match);
      await withdrawFromBuyerWallet(newTransaction.user_id, match);

      setTransactions((prev) =>
        prev.filter((t) => t.id !== match.id && t.id !== newTransaction.id),
      );
    } else {
      console.log(
        `[No Match] ${newTransaction.type} order at R$${newTransaction.price} — no counterpart found in the book.`,
      );
    }
  }

  async function handleSubmitOrder(order: Transaction) {
    const response = await fetch(`http://localhost:3000/api/transactions`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      console.error('Failed to submit order', await response.text());
      throw new Error('Failed to submit order');
    }

    const data = await response.json();
    const newTransaction: Transaction = { ...data, user_name: order.user_name };
    setTransactions((prev) => [...prev, newTransaction]);
    await checkOrderMatch(transactions, newTransaction);

    const cashChange =
      order.type === 'BUY'
        ? -order.price * order.quantity
        : order.type === 'SELL'
          ? 0
          : order.price * order.quantity;

    dispatch(
      setUser({
        ...user,
        available_cash: (user.available_cash || 0) + cashChange,
      }),
    );

    return { ...data, user_name: order.user_name };
  }

  return (
    <Box
      sx={{
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '8px',
        bgcolor: c.panel2,
        p: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '8px',
        flexShrink: 0,
        overflow: 'auto',
      }}
    >
      <Typography sx={{ fontSize: 13, color: c.text2, fontWeight: 600 }}>
        Order Ticket
      </Typography>

      {/* Buy / Sell toggle */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {(['buy', 'sell'] as const).map((s) => (
          <Box
            key={s}
            component="button"
            onClick={() => {
              setSide(s);
              setOrderData((prev) => ({
                ...prev,
                type: s.toUpperCase() as 'BUY' | 'SELL',
              }));
            }}
            sx={{
              height: 32,
              border:
                s === 'buy'
                  ? `1px solid ${side === 'buy' ? 'rgba(60,165,111,0.8)' : 'rgba(60,165,111,0.35)'}`
                  : `1px solid ${side === 'sell' ? 'rgba(191,95,95,0.8)' : 'rgba(191,95,95,0.35)'}`,
              borderRadius: '8px',
              bgcolor:
                s === side
                  ? s === 'buy'
                    ? 'rgba(60,165,111,0.12)'
                    : 'rgba(191,95,95,0.12)'
                  : '#1a2940',
              color: s === 'buy' ? '#c7f0d9' : '#f0c6c6',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: '"IBM Plex Sans", sans-serif',
              cursor: 'pointer',
              transition: 'background-color 120ms ease',
            }}
          >
            {s === 'buy' ? 'Buy' : 'Sell'}
          </Box>
        ))}
      </Box>

      {/* Fields grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {[
          {
            label: 'Quantity',
            type: 'input',
            value: orderData.quantity.toString(),
            key: 'quantity',
          },
          {
            label: 'Price',
            type: 'input',
            value: orderData.price.toString(),
            key: 'price',
          },
        ].map((f, i) => (
          <Box key={i} sx={{ display: 'grid', gap: '5px' }}>
            <Typography
              sx={{ fontSize: 11, color: c.text3, letterSpacing: '0.02em' }}
            >
              {f.label}
            </Typography>
            {f.type === 'select' ? (
              <Select
                defaultValue={f.options![0]}
                size="small"
                sx={{
                  height: 34,
                  fontSize: 12,
                  color: c.text,
                  bgcolor: '#1a2940',
                  borderRadius: '7px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(58,82,112,0.72)',
                  },
                  '& .MuiSelect-select': { py: '5px', fontSize: 12 },
                  '& .MuiSvgIcon-root': { color: c.text3 },
                }}
              >
                {f.options!.map((o) => (
                  <MenuItem key={o} value={o} sx={{ fontSize: 12 }}>
                    {o}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <Box
                component="input"
                defaultValue={f.value}
                sx={{
                  height: 34,
                  border: '1px solid rgba(58,82,112,0.72)',
                  borderRadius: '7px',
                  bgcolor: '#1a2940',
                  color: c.text,
                  px: '10px',
                  fontSize: 12,
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  outline: 'none',
                  '&:focus': { borderColor: 'rgba(58,82,112,1)' },
                }}
                onChange={(e) => {
                  setOrderData((prev) => {
                    return {
                      ...prev,
                      [f.key]:
                        f.key === 'quantity'
                          ? parseInt(e.target.value)
                          : parseFloat(e.target.value.replace(',', '.')),
                    };
                  });
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <Box
        component="button"
        sx={{
          height: 34,
          border: `1px solid ${c.actionEdge}`,
          borderRadius: '8px',
          bgcolor: c.action,
          color: c.text,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: '"IBM Plex Sans", sans-serif',
          cursor: 'pointer',
          '&:hover': { bgcolor: '#285079' },
        }}
        onClick={() => handleSubmitOrder(orderData)}
      >
        Submit Order
      </Box>
    </Box>
  );
};

function OrdersTable() {
  return (
    <Box
      sx={{
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '8px',
        bgcolor: c.panel2,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Table header */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 0.7fr 0.7fr 0.7fr 0.9fr 0.9fr 0.9fr',
          alignItems: 'center',
          px: '10px',
          height: 32,
          color: c.text4,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          borderBottom: '1px solid rgba(48,68,94,0.5)',
          bgcolor: 'rgba(17,29,47,0.7)',
          flexShrink: 0,
        }}
      >
        {ORDERS_COLS.map((col) => (
          <span key={col}>{col}</span>
        ))}
      </Box>
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ display: 'none' }}>
            <TableRow>
              {ORDERS_COLS.map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {ORDERS_DATA.map((row, i) => (
              <TableRow
                key={i}
                sx={{ '&:hover': { bgcolor: 'rgba(26,41,64,0.36)' } }}
              >
                {row.map((cell, j) => (
                  <TableCell
                    key={j}
                    sx={{
                      fontSize: 12,
                      borderBottom: '1px solid rgba(48,68,94,0.3)',
                      py: '5px',
                      px: '10px',
                      whiteSpace: 'nowrap',
                      color:
                        j === 4
                          ? statusColor(cell)
                          : j === 1
                            ? cell === 'BUY'
                              ? c.up
                              : c.down
                            : c.text2,
                    }}
                  >
                    {j === 4 ? (
                      <Box
                        component="span"
                        sx={{
                          border: '1px solid rgba(58,82,112,0.68)',
                          bgcolor: '#1a2940',
                          borderRadius: '999px',
                          px: '7px',
                          py: '2px',
                          fontSize: 10,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {cell}
                      </Box>
                    ) : (
                      cell
                    )}
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

// MainPanel interface
interface MainPanelProp {
  isEvenMoreCompact: boolean;
}

const MainPanel: FC<MainPanelProp> = ({ isEvenMoreCompact }): JSX.Element => {
  const selectedStock = useAppSelector(selectSelectedStock);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactionsForBookData() {
      const transactions = await fetchTransactionsForBook(selectedStock?.id);
      setTransactions(transactions);
      console.log('Fetched transactions:', transactions);
    }

    fetchTransactionsForBookData();
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
      {/* Asset header */}
      <Box
        sx={{
          borderBottom: `1px solid ${c.lineSoft}`,
          px: '10px',
          py: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
              fontSize: 20,
              color: c.text,
            }}
          >
            {selectedStock?.symbol || 'Asset'} — Order Negotiation Book
          </Typography>
          <Typography sx={{ mt: '3px', color: c.text4, fontSize: 12 }}>
            {selectedStock?.name || 'Company Name'} · Last{' '}
            {selectedStock?.current_price || '0.00'} · Spread 0.02 · Vol 31.2M
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {[
            {
              label: `${selectedStock?.percentage_change && selectedStock?.percentage_change > 0 ? '+' : ''}${selectedStock?.percentage_change?.toFixed(2) || '0.00'}%`,
              up:
                selectedStock?.percentage_change &&
                selectedStock?.percentage_change > 0
                  ? true
                  : selectedStock?.percentage_change &&
                      selectedStock?.percentage_change < 0
                    ? false
                    : undefined,
            },
          ].map(({ label, up }) => (
            <Box
              key={label}
              sx={{
                border: '1px solid rgba(58,82,112,0.72)',
                bgcolor: '#1a2940',
                borderRadius: '7px',
                px: '8px',
                py: '5px',
                fontSize: 12,
                whiteSpace: 'nowrap',
                color: up === true ? c.up : up === false ? c.down : c.text3,
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Two-column body */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          height: '100%',
          display: 'grid',
          gridTemplateColumns: isEvenMoreCompact ? '1fr' : '1fr 1fr',
          gap: '10px',
          p: '10px',
          overflow: 'hidden',
        }}
      >
        {/* Col 1: Order Book */}
        <OrderBook transactions={transactions} />

        {/* Col 2: Ticket on top, Orders table below */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <OrderTicket
            setTransactions={setTransactions}
            transactions={transactions}
          />
          <OrdersTable />
        </Box>
      </Box>
    </Paper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Book() {
  const isCompact = useMediaQuery('(max-width: 1316px)');
  const isMoreCompact = useMediaQuery('(max-width: 900px)');
  const isEvenMoreCompact = useMediaQuery('(max-width: 700px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <BookTopBar isCompact={isCompact} />

      {/*isCompact && <div style={{ height: '0' }} />*/}

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          ...(isCompact ? { p: '4rem 2rem 2rem 2rem' } : { p: '2rem' }),
          overflow: 'auto',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Grid
          container
          columns={{ xs: 4, md: 12 }}
          spacing={1.25}
          alignItems="stretch"
          sx={{ height: isCompact ? 'fit-content' : '100%' }}
        >
          {/* Sidebar */}
          {!isMoreCompact && (
            <Grid size={{ xs: 4, md: 2 }} sx={{ minHeight: 0, height: '100%' }}>
              <Sidebar />
            </Grid>
          )}

          {/* Main panel */}
          <Grid
            size={{ xs: 4, md: isMoreCompact ? 12 : isCompact ? 10 : 7 }}
            sx={{ minHeight: 0, height: '100%' }}
          >
            <MainPanel isEvenMoreCompact={isEvenMoreCompact} />
          </Grid>

          {/* Right panel */}
          {!isCompact && (
            <Grid size={{ xs: 4, md: 3 }} sx={{ minHeight: 0, height: '100%' }}>
              <RightPanel />
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Mobile sidebar overlay */}
      {isMoreCompact && (
        <>
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
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 220,
              zIndex: 51,
              transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 220ms ease',
            }}
          >
            <Sidebar />
          </Box>
          <Box
            component="button"
            onClick={() => setSidebarOpen((v) => !v)}
            sx={{
              position: 'fixed',
              bottom: 16,
              left: 16,
              zIndex: 52,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: `1px solid ${c.actionEdge}`,
              bgcolor: c.action,
              color: c.text,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ☰
          </Box>
        </>
      )}
    </Box>
  );
}
