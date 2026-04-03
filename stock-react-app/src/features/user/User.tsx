import { useState, useEffect } from 'react';
import type { FC, JSX } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  useMediaQuery,
} from '@mui/material';

// ── Design tokens ─────────────────────────────────────────────────────────────

const c = {
  bg: '#0b1524',
  panel: '#0f1b2b',
  panel2: '#111d2f',
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
  { label: 'IBOV',    value: '129,881', change: '+0.62%', up: true  },
  { label: 'USD/BRL', value: '4.9283',  change: '-0.23%', up: false },
  { label: 'IFIX',    value: '3,289',   change: '+0.18%', up: true  },
];

const NAV_ITEMS = [
  'Dashboard',
  'Portfolio',
  'Orders',
  'Transfers',
  'User',
  'Security',
];

const QUICK_BALANCES = [
  { label: 'Available Cash',  value: 'R$ 118,420', down: false },
  { label: 'Pending Funds',   value: 'R$ 4,100',   down: true  },
  { label: 'Credit Limit',    value: 'R$ 30,000',  down: false },
];

const SUMMARY_TILES = [
  {
    key:    'Verification Status',
    value:  'KYC Approved',
    meta:   'Compliant · Updated today',
    metaUp: true,
  },
  {
    key:    'Security Posture',
    value:  'Strong',
    meta:   '2FA enabled · 3 trusted devices',
    metaUp: null,
  },
  {
    key:    'Funding Availability',
    value:  'Same Day',
    meta:   'PIX deposits up to R$ 250,000',
    metaUp: null,
  },
];

const PERSONAL_FIELDS = [
  { label: 'First Name',    value: 'Pedro',                           type: 'input'  },
  { label: 'Last Name',     value: 'Barbosa',                         type: 'input'  },
  { label: 'Email',         value: 'pedro.barbosa@moneybuilder.com',  type: 'input'  },
  { label: 'Phone',         value: '+55 11 98888-1200',               type: 'input'  },
  { label: 'CPF',           value: '***.***.***-90',                  type: 'input'  },
  { label: 'Date of Birth', value: '1989-08-14',                      type: 'input'  },
];

const COMPLIANCE_FIELDS = [
  { label: 'Address',              value: 'Av. Paulista, 1800',   type: 'input',  options: []                                       },
  { label: 'City',                 value: 'São Paulo',             type: 'input',  options: []                                       },
  { label: 'State',                value: 'SP',                    type: 'select', options: ['SP', 'RJ', 'MG', 'RS', 'PR']           },
  { label: 'ZIP',                  value: '01310-200',             type: 'input',  options: []                                       },
  { label: 'Tax Residency',        value: 'Brazil',                type: 'select', options: ['Brazil', 'Other']                      },
  { label: 'Professional Profile', value: 'Individual Investor',   type: 'select', options: ['Individual Investor', 'Professional']  },
];

const SECURITY_ROWS = [
  { title: 'Password',                    detail: 'Updated 42 days ago',                              action: 'Change' },
  { title: 'Two-Factor Authentication',   detail: 'Authenticator app + backup code enabled',          action: 'Manage' },
  { title: 'Trusted Session Devices',     detail: '3 active devices · Last login 10:41:03',           action: 'Review' },
];

const ACCOUNT_EVENTS = [
  { msg: 'Profile email updated successfully.',          detail: 'Trace: EVT-22319 · 10:21:54'       },
  { msg: 'Device trust granted after 2FA challenge.',    detail: 'Trace: EVT-22302 · 09:58:13'       },
  { msg: 'Password reset policy acknowledged.',          detail: 'Trace: EVT-22274 · 08:12:43'       },
];

const PENDING_REQUESTS = [
  { msg: 'Address confirmation document under review.',  detail: 'KYC queue · ETA 2h'                },
  { msg: 'Deposit review in progress.',                  detail: 'TRX-884120 · anti-fraud check'     },
];

const COMPLIANCE_NOTICES = [
  { msg: 'Risk signal: transfer velocity exceeded user baseline.', detail: 'No block applied, enhanced monitoring active.', up: false },
  { msg: 'Status: account remains enabled for trading.',           detail: 'Last compliance sync: 10:39:11',                up: true  },
];

// ── Shared field components ───────────────────────────────────────────────────

const inputSx = {
  height: 34,
  border: '1px solid rgba(58,82,112,0.72)',
  borderRadius: '7px',
  bgcolor: '#1a2940',
  color: c.text,
  px: '10px',
  fontSize: 12,
  fontFamily: '"IBM Plex Sans", sans-serif',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box' as const,
  '&:focus': { borderColor: '#5d84af', boxShadow: '0 0 0 2px rgba(47,90,134,0.48)' },
};

function Field({
  label,
  value,
  type = 'input',
  options = [],
}: {
  label: string;
  value: string;
  type?: 'input' | 'select';
  options?: string[];
}) {
  return (
    <Box sx={{ display: 'grid', gap: '5px' }}>
      <Typography sx={{ fontSize: 11, color: c.text3, letterSpacing: '0.02em' }}>
        {label}
      </Typography>
      {type === 'select' ? (
        <Select
          defaultValue={value}
          size="small"
          sx={{
            height: 34,
            fontSize: 12,
            color: c.text,
            bgcolor: '#1a2940',
            borderRadius: '7px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(58,82,112,0.72)' },
            '& .MuiSelect-select': { py: '5px', fontSize: 12 },
            '& .MuiSvgIcon-root': { color: c.text3 },
          }}
        >
          {options.map((o) => (
            <MenuItem key={o} value={o} sx={{ fontSize: 12 }}>{o}</MenuItem>
          ))}
        </Select>
      ) : (
        <Box component="input" defaultValue={value} sx={inputSx} />
      )}
    </Box>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface UserTopBarProps {
  isCompact: boolean;
}

const UserTopBar: FC<UserTopBarProps> = ({ isCompact }): JSX.Element => (
  <Box
    component="header"
    sx={{
      height: !isCompact ? 54 : 108,
      borderBottom: `1px solid ${c.lineSoft}`,
      bgcolor: 'rgba(17,29,47,0.92)',
      display: !isCompact ? 'grid' : 'flex',
      flexDirection: 'column',
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
          width: 14, height: 14,
          border: '1px solid #3a5270',
          borderRadius: '4px',
          bgcolor: '#1a2940',
          flexShrink: 0,
        }}
      />
      MoneyBuilder Broker
    </Box>

    {/* Market tickers */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', color: c.text3, whiteSpace: 'nowrap' }}>
      {TICKERS.map(({ label, value, change, up }) => (
        <Typography key={label} component="span" sx={{ fontSize: 12, color: c.text3 }}>
          <Box component="strong" sx={{ color: c.text2, fontWeight: 600, mr: '4px' }}>{label}</Box>
          {value}{' '}
          <Box component="span" sx={{ color: up ? c.up : c.down }}>{change}</Box>
        </Typography>
      ))}
    </Box>

    {/* Chips */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px' }}>
      {['Conta: Prime', 'Session: Open'].map((label) => (
        <Box
          key={label}
          sx={{
            height: 30, px: '10px',
            border: '1px solid rgba(58,82,112,0.76)',
            bgcolor: '#1a2940',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center',
            fontSize: 11, color: c.text3, whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Box>
      ))}
    </Box>
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────

function Sidebar() {
  const [activeNav, setActiveNav] = useState('User');

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
      {/* Profile mini */}
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
        User Context
        <Typography component="strong" sx={{ display: 'block', color: c.text2, mt: '2px', fontSize: 13, fontWeight: 600 }}>
          Pedro Barbosa
        </Typography>
        CPF verified · KYC level 2
      </Box>

      {/* Nav */}
      <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
        {NAV_ITEMS.map((item) => (
          <Box
            key={item}
            component="button"
            onClick={() => setActiveNav(item)}
            sx={{
              height: 34,
              border: activeNav === item ? '1px solid #3a5270' : '1px solid transparent',
              borderRadius: '8px',
              bgcolor: activeNav === item ? '#1a2940' : 'transparent',
              color: activeNav === item ? c.text : c.text3,
              textAlign: 'left',
              px: '10px',
              fontSize: 13,
              fontWeight: activeNav === item ? 600 : 500,
              fontFamily: '"IBM Plex Sans", sans-serif',
              cursor: 'pointer',
              transition: 'background-color 120ms ease, border-color 120ms ease',
              '&:hover': { bgcolor: activeNav === item ? '#1a2940' : 'rgba(26,41,64,0.4)' },
            }}
          >
            {item}
          </Box>
        ))}
      </Box>

      {/* Quick balances */}
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
        <Typography sx={{ fontSize: 11, color: c.text4, flexShrink: 0 }}>Quick Balances</Typography>
        {QUICK_BALANCES.map(({ label, value, down }) => (
          <Box
            key={label}
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
            <span>{label}</span>
            <Box component="span" sx={{ color: down ? c.down : c.text2 }}>{value}</Box>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Typography sx={{ fontSize: 11, color: c.text4, flexShrink: 0 }}>
        Latency 22ms | Feed RT-B3
      </Typography>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ActionBtn({
  label,
  primary = false,
}: {
  label: string;
  primary?: boolean;
}) {
  return (
    <Box
      component="button"
      sx={{
        height: 32,
        border: primary ? `1px solid ${c.actionEdge}` : '1px solid rgba(58,82,112,0.78)',
        borderRadius: '8px',
        bgcolor: primary ? c.action : '#1a2940',
        color: primary ? c.text : c.text2,
        px: '12px',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: '"IBM Plex Sans", sans-serif',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        '&:hover': { opacity: 0.85 },
      }}
    >
      {label}
    </Box>
  );
}

function FormPanel({
  title,
  fields,
  hint,
}: {
  title: string;
  fields: { label: string; value: string; type?: string; options?: string[] }[];
  hint: string;
}) {
  return (
    <Box
      sx={{
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '8px',
        bgcolor: c.panel2,
        p: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <Typography sx={{ fontSize: 13, color: c.text2, fontWeight: 600, letterSpacing: '0.01em' }}>
        {title}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {fields.map((f) => (
          <Field
            key={f.label}
            label={f.label}
            value={f.value}
            type={f.type as 'input' | 'select'}
            options={f.options}
          />
        ))}
      </Box>
      <Typography sx={{ fontSize: 11, color: c.text4 }}>{hint}</Typography>
    </Box>
  );
}

function MainPanel() {
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
      {/* Page header */}
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
            sx={{ m: 0, fontFamily: '"Manrope", sans-serif', fontWeight: 700, fontSize: 20, color: c.text }}
          >
            User Profile &amp; Funding
          </Typography>
          <Typography sx={{ mt: '3px', color: c.text4, fontSize: 12 }}>
            Last update 10:43:21 · Account Trace ID: MBR-239991-A
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '6px' }}>
          <ActionBtn label="Save Changes" primary />
          <ActionBtn label="Cancel" />
          <ActionBtn label="Reset" />
        </Box>
      </Box>

      {/* Summary tiles */}
      <Box
        sx={{
          borderBottom: `1px solid ${c.lineSoft}`,
          p: '10px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        {SUMMARY_TILES.map((t) => (
          <Box
            key={t.key}
            sx={{
              border: `1px solid ${c.lineSoft}`,
              borderRadius: '8px',
              bgcolor: c.panel2,
              p: '9px 10px',
              display: 'grid',
              gap: '4px',
            }}
          >
            <Typography sx={{ fontSize: 11, color: c.text4 }}>{t.key}</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 600, fontFamily: '"Manrope", sans-serif', color: c.text }}>
              {t.value}
            </Typography>
            <Typography sx={{ fontSize: 11, color: t.metaUp === true ? c.up : t.metaUp === false ? c.down : c.text3 }}>
              {t.meta}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Two-column edit zone */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          p: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* Forms row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <FormPanel
            title="Personal Data"
            fields={PERSONAL_FIELDS}
            hint="All required fields validated for trading account continuity."
          />
          <FormPanel
            title="Contact & Compliance"
            fields={COMPLIANCE_FIELDS}
            hint="Compliance profile synced at 09:58:04 with no pending mismatch."
          />
        </Box>

        {/* Security rows */}
        <Box
          sx={{
            border: `1px solid ${c.lineSoft}`,
            borderRadius: '8px',
            bgcolor: c.panel2,
            p: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
          }}
        >
          <Typography sx={{ fontSize: 11, color: c.text4, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Security
          </Typography>
          {SECURITY_ROWS.map((row) => (
            <Box
              key={row.title}
              sx={{
                border: '1px solid rgba(48,68,94,0.55)',
                borderRadius: '8px',
                bgcolor: '#1a2940',
                p: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
                fontSize: 12,
                color: c.text3,
              }}
            >
              <Box>
                <Typography component="strong" sx={{ color: c.text2, display: 'block', mb: '2px', fontSize: 12, fontWeight: 600 }}>
                  {row.title}
                </Typography>
                {row.detail}
              </Box>
              <ActionBtn label={row.action} />
            </Box>
          ))}
        </Box>

        {/* Deposit funds */}
        <Box
          sx={{
            border: `1px solid ${c.lineSoft}`,
            borderRadius: '8px',
            bgcolor: 'rgba(17,29,47,0.62)',
            p: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Deposit header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <Typography sx={{ fontSize: 13, color: c.text2, fontWeight: 600 }}>
              Deposit Funds
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(58,82,112,0.72)',
                bgcolor: '#1a2940',
                borderRadius: '8px',
                px: '10px',
                py: '7px',
                fontSize: 12,
                color: c.text3,
              }}
            >
              <Box component="span" sx={{ color: c.up }}>Operational</Box>
              {' · Settlement trace required'}
            </Box>
          </Box>

          {/* Fund grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', alignItems: 'end' }}>
            <Field label="Amount" value="R$ 10,000.00" />
            <Field
              label="Source Account"
              value="Banco Itaú - ****4451"
              type="select"
              options={['Banco Itaú - ****4451', 'Banco Bradesco - ****3312']}
            />
            <Field
              label="Method"
              value="PIX Instant Transfer"
              type="select"
              options={['PIX Instant Transfer', 'TED', 'DOC']}
            />
            <ActionBtn label="Deposit Funds" primary />
          </Box>

          {/* Warning note */}
          <Box
            sx={{
              border: '1px solid rgba(191,95,95,0.5)',
              bgcolor: 'rgba(50,24,28,0.52)',
              borderRadius: '8px',
              color: '#d9b1b1',
              p: '7px 9px',
              fontSize: 11,
            }}
          >
            Funding hold: one transfer is still in anti-fraud review (Operation ID: TRX-884120).
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function LogItem({ msg, detail, up }: { msg: string; detail: string; up?: boolean }) {
  return (
    <Box
      sx={{
        borderTop: '1px solid rgba(48,68,94,0.4)',
        pt: '7px',
        fontSize: 12,
        color: c.text3,
        lineHeight: 1.36,
        '&:first-of-type': { borderTop: 0, pt: 0 },
      }}
    >
      {up === true && <Box component="span" sx={{ color: c.up }}>Status: </Box>}
      {up === false && <Box component="span" sx={{ color: c.down }}>Risk signal: </Box>}
      {up !== undefined
        ? msg.replace(/^(Status:|Risk signal:)\s*/i, '')
        : msg}
      <Typography component="small" sx={{ display: 'block', color: c.text4, mt: '2px', fontSize: 11 }}>
        {detail}
      </Typography>
    </Box>
  );
}

function RightInfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        border: `1px solid ${c.lineSoft}`,
        borderRadius: '8px',
        bgcolor: 'rgba(17,29,47,0.68)',
        p: '9px',
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        flexShrink: 0,
      }}
    >
      <Typography sx={{ fontSize: 12, color: c.text2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function RightPanel() {
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
        overflow: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <RightInfoBox title="Recent Account Events">
        {ACCOUNT_EVENTS.map((e, i) => (
          <LogItem key={i} msg={e.msg} detail={e.detail} />
        ))}
      </RightInfoBox>

      <RightInfoBox title="Pending Requests">
        {PENDING_REQUESTS.map((e, i) => (
          <LogItem key={i} msg={e.msg} detail={e.detail} />
        ))}
      </RightInfoBox>

      <RightInfoBox title="Compliance Notices">
        {COMPLIANCE_NOTICES.map((e, i) => (
          <LogItem key={i} msg={e.msg} detail={e.detail} up={e.up} />
        ))}
      </RightInfoBox>
    </Paper>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function User() {
  const isCompact = useMediaQuery('(max-width: 1316px)');
  const isMoreCompact = useMediaQuery('(max-width: 900px)');
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
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <UserTopBar isCompact={isCompact} />

      {isCompact && <div style={{ height: '2rem' }} />}

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          p: '2rem',
          overflow: 'hidden',
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
            <MainPanel />
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
              top: 0, left: 0, bottom: 0,
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
              bottom: 16, left: 16,
              zIndex: 52,
              width: 40, height: 40,
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
