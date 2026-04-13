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
  Snackbar,
  Alert,
} from '@mui/material';
import RightPanel from '../../components/RightPanel';
import Sidebar from '../../components/Sidebar';
import { useAppSelector } from '../../hooks';
import { selectUser, User } from '../auth/authSlice';

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
  { label: 'IBOV', value: '129,881', change: '+0.62%', up: true },
  { label: 'USD/BRL', value: '4.9283', change: '-0.23%', up: false },
  { label: 'IFIX', value: '3,289', change: '+0.18%', up: true },
];

const PERSONAL_FIELDS = [
  { label: 'name', value: 'Pedro', type: 'input' },
  { label: 'email', value: 'pedro.barbosa@moneybuilder.com', type: 'input' },
  { label: 'color', value: 'red', type: 'input' },
  { label: 'birth', value: '1989-08-14', type: 'input' },
];

const COMPLIANCE_FIELDS = [
  { label: 'Address', value: 'Av. Paulista, 1800', type: 'input', options: [] },
  { label: 'City', value: 'São Paulo', type: 'input', options: [] },
  {
    label: 'State',
    value: 'SP',
    type: 'select',
    options: ['SP', 'RJ', 'MG', 'RS', 'PR'],
  },
  { label: 'ZIP', value: '01310-200', type: 'input', options: [] },
  {
    label: 'Tax Residency',
    value: 'Brazil',
    type: 'select',
    options: ['Brazil', 'Other'],
  },
  {
    label: 'Professional Profile',
    value: 'Individual Investor',
    type: 'select',
    options: ['Individual Investor', 'Professional'],
  },
];

const SECURITY_ROWS = [
  { title: 'Password', detail: 'Updated 42 days ago', action: 'Change' },
  {
    title: 'Two-Factor Authentication',
    detail: 'Authenticator app + backup code enabled',
    action: 'Manage',
  },
  {
    title: 'Trusted Session Devices',
    detail: '3 active devices · Last login 10:41:03',
    action: 'Review',
  },
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
  '&:focus': {
    borderColor: '#5d84af',
    boxShadow: '0 0 0 2px rgba(47,90,134,0.48)',
  },
};

function Field({
  label,
  value,
  type = 'input',
  options = [],
  error,
  setUserData,
}: {
  label: string;
  value: string;
  type?: 'input' | 'select';
  date?: boolean;
  options?: string[];
  error?: boolean;
  setUserData?: (e: React.SetStateAction<User>) => void;
}) {
  return (
    <Box sx={{ display: 'grid', gap: '5px' }}>
      <Typography
        sx={{ fontSize: 11, color: error ? c.down : c.text3, letterSpacing: '0.02em' }}
      >
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
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(58,82,112,0.72)',
            },
            '& .MuiSelect-select': { py: '5px', fontSize: 12 },
            '& .MuiSvgIcon-root': { color: c.text3 },
          }}
        >
          {options.map((o) => (
            <MenuItem key={o} value={o} sx={{ fontSize: 12 }}>
              {o}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Box
          component="input"
          type={label === 'birth' ? 'date' : 'text'}
          defaultValue={value}
          sx={{
            ...inputSx,
            ...(error && {
              borderColor: c.down,
              '&:focus': { borderColor: c.down, boxShadow: '0 0 0 2px rgba(191,95,95,0.35)' },
            }),
          }}
          onChange={(e) =>
            setUserData &&
            setUserData((prev) => ({ ...prev, [label]: e.target.value }))
          }
        />
      )}
      {error && (
        <Typography sx={{ fontSize: 10, color: c.down }}>
          Campo obrigatório
        </Typography>
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

function ActionBtn({
  label,
  primary = false,
  onClick,
}: {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        height: 32,
        border: primary
          ? `1px solid ${c.actionEdge}`
          : '1px solid rgba(58,82,112,0.78)',
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
  errors,
  setUserData,
}: {
  title: string;
  fields: {
    label: string;
    value: string;
    type?: string;
    options?: string[];
    date?: boolean;
  }[];
  errors?: Record<string, boolean>;
  setUserData?: (e: React.SetStateAction<User>) => void;
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
      <Typography
        sx={{
          fontSize: 13,
          color: c.text2,
          fontWeight: 600,
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {fields.map((f) => (
          <Field
            key={f.label}
            label={f.label}
            value={f.value}
            type={f.type as 'input' | 'select'}
            date={f.date}
            options={f.options}
            error={errors?.[f.label]}
            setUserData={setUserData}
          />
        ))}
      </Box>
    </Box>
  );
}

const REQUIRED_FIELDS = ['name', 'email', 'color', 'birth'] as const;

function MainPanel() {
  const user = useAppSelector(selectUser);
  const [userData, setUserData] = useState<User>(user);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [toastOpen, setToastOpen] = useState(false);

  const PERSONAL_FIELDS = [
    { label: 'name', value: userData.name ?? '', type: 'input' },
    { label: 'email', value: userData.email ?? '', type: 'input' },
    { label: 'color', value: userData.color ?? '', type: 'input' },
    {
      label: 'birth',
      value: userData.birth ? userData.birth.slice(0, 10) : '',
      type: 'input',
      date: true,
    },
  ];

  const handleSaveChanges = async () => {
    const errors: Record<string, boolean> = {};
    for (const field of REQUIRED_FIELDS) {
      if (!userData[field] || String(userData[field]).trim() === '') {
        errors[field] = true;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    try {
      const res = await fetch('http://localhost:3000/api/users', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        setToastOpen(true);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

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
            sx={{
              m: 0,
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 700,
              fontSize: 20,
              color: c.text,
            }}
          >
            User Profile &amp; Funding
          </Typography>
          <Typography sx={{ mt: '3px', color: c.text4, fontSize: 12 }}>
            Last update 10:43:21 · Account Trace ID: MBR-239991-A
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '6px' }}>
          <ActionBtn label="Save Changes" primary onClick={handleSaveChanges} />
        </Box>
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
          <FormPanel
            title="Personal Data"
            fields={PERSONAL_FIELDS}
            errors={fieldErrors}
            setUserData={setUserData}
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
          <Typography
            sx={{
              fontSize: 11,
              color: c.text4,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 600,
            }}
          >
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
                <Typography
                  component="strong"
                  sx={{
                    color: c.text2,
                    display: 'block',
                    mb: '2px',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {row.title}
                </Typography>
                {row.detail}
              </Box>
              <ActionBtn
                label={row.action}
                onClick={() => console.log(userData)}
              />
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
            }}
          >
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
              <Box component="span" sx={{ color: c.up }}>
                Operational
              </Box>
              {' · Settlement trace required'}
            </Box>
          </Box>

          {/* Fund grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: '8px',
              alignItems: 'end',
            }}
          >
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
        </Box>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Informações atualizadas com sucesso!
        </Alert>
      </Snackbar>
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
