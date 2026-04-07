import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
  Paper,
  InputAdornment,
  Grid,
  Snackbar,
  SnackbarCloseReason,
} from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { setLoginSuccess, setUser } from '../auth/authSlice';

// ── Design tokens ────────────────────────────────────────────────────────────

const c = {
  bgBase: '#0b1524',
  lineStrong: '#30445e',
  lineSoft: 'rgba(48, 68, 94, 0.64)',
  ctaFill: '#234467',
  ctaEdge: '#2f5a86',
  textPrimary: '#f2f5f8',
  textSecondary: '#d7dee7',
  textTertiary: '#b4c0cf',
  textMuted: '#8fa1b7',
  semanticUp: '#3ca56f',
  semanticDown: '#bf5f5f',
};

// ── Static data ──────────────────────────────────────────────────────────────

const TICKERS = [
  { label: 'IBOV', value: '129,881', change: '+0.62%', up: true },
  { label: 'USD/BRL', value: '4.9283', change: '-0.23%', up: false },
  { label: 'IFIX', value: '3,289', change: '+0.18%', up: true },
];

// ── Shared sx ────────────────────────────────────────────────────────────────

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#1a2940',
    color: c.textPrimary,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.01em',
    fontFamily: '"IBM Plex Sans", sans-serif',
    '& fieldset': { borderColor: 'rgba(58, 82, 112, 0.72)' },
    '&:hover fieldset': { borderColor: 'rgba(95, 132, 175, 0.78)' },
    '&.Mui-focused fieldset': { borderColor: '#5d84af' },
    '&.Mui-focused': { bgcolor: '#1c2e43' },
  },
  '& .MuiInputLabel-root': {
    color: c.textSecondary,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
  '& .MuiInputLabel-root.Mui-focused': { color: c.textSecondary },
  '& input::placeholder': { color: c.textMuted, opacity: 1 },
};

// ── Sub-components ───────────────────────────────────────────────────────────

function TopBar() {
  return (
    <AppBar
      position="relative"
      sx={{
        height: 56,
        bgcolor: 'rgba(17, 29, 47, 0.92)',
        borderBottom: `1px solid ${c.lineSoft}`,
        boxShadow: 'none',
        zIndex: 2,
      }}
    >
      <Grid container sx={{ justifyContent: 'space-between', px: { xs: 4 } }}>
        <Toolbar
          sx={{
            height: 56,
            width: '100%',
            minHeight: '56px !important',
            px: '0px !important',
            justifyContent: 'space-between',
          }}
        >
          <Grid size={8}>
            {/* Brand */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                letterSpacing: '0.01em',
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 15,
                  height: 15,
                  border: '1px solid #3a5270',
                  bgcolor: '#1a2940',
                  borderRadius: '4px',
                  boxShadow: 'inset 0 0 0 1px rgba(242,245,248,0.05)',
                  flexShrink: 0,
                }}
              />
              <Typography
                component="h1"
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: c.textPrimary,
                  m: 0,
                }}
              >
                MoneyBuilder Broker
              </Typography>
            </Box>
          </Grid>

          <Grid size={4}>
            {/* Ticker strip — hidden on mobile */}
            <Box
              component="nav"
              aria-label="Market context"
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '18px',
              }}
            >
              {TICKERS.map(({ label, value, change, up }) => (
                <Typography
                  key={label}
                  component="span"
                  sx={{ color: c.textTertiary, fontSize: 12 }}
                >
                  <Box
                    component="strong"
                    sx={{ color: c.textSecondary, fontWeight: 600, mr: '4px' }}
                  >
                    {label}
                  </Box>
                  {value}{' '}
                  <Box
                    component="span"
                    sx={{ color: up ? c.semanticUp : c.semanticDown }}
                  >
                    {change}
                  </Box>
                </Typography>
              ))}

              <Box
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderColor: c.lineStrong,
                  bgcolor: '#1a2940',
                  borderRadius: '7px',
                  fontSize: 11,
                  color: c.textTertiary,
                  height: 28,
                  px: '8px',
                }}
              >
                Market Open
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: c.semanticUp,
                    flexShrink: 0,
                    animation: 'pulse 2.2s ease-out infinite',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(60,165,111,0.5)' },
                      '70%': { boxShadow: '0 0 0 8px rgba(60,165,111,0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(60,165,111,0)' },
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Toolbar>
      </Grid>
    </AppBar>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface UserData {
  name?: string;
  email: string;
  password: string;
}

function SignInPanel() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    passwordMatch: '',
  });
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openFail, setOpenFail] = React.useState(false);

  const handleOpenSuccess = () => {
    setOpenSuccess(true);
  };

  const handleCloseSuccess = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
  };

  const handleOpenFail = () => {
    setOpenFail(true);
  };

  const handleCloseFail = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenFail(false);
  };

  function validate() {
    const next = { name: '', email: '', passwordMatch: '' };
    if (!userData.name.trim()) next.name = 'Name is required.';
    if (!userData.email.trim()) next.email = 'Email is required.';
    if (userData.password !== confirmPassword)
      next.passwordMatch = 'Passwords do not match.';
    setErrors(next);
    return !next.name && !next.email && !next.passwordMatch;
  }

  async function handleSignUp(userData: UserData) {
    if (!validate()) return;
    const res = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }),
    });

    console.log('Response:', res);

    if (!res.ok) {
      handleOpenFail();
      throw new Error('Failed to create user');
    } else {
      handleOpenSuccess();
    }
  }

  return (
    <>
      <Paper
        component="section"
        aria-label="Create account form"
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          border: '1px solid rgba(48,68,94,0.58)',
          background:
            'linear-gradient(180deg, rgba(15,27,43,0.97) 0%, rgba(13,24,39,0.97) 100%)',
          borderRadius: '12px',
          p: { xs: '20px 16px 18px', md: '30px 30px 24px' },
          boxShadow: '0 24px 44px rgba(5,11,18,0.32)',
          animation: 'panelRise 520ms ease-out both',
          position: 'relative',
          overflow: 'hidden',
          '@keyframes panelRise': {
            from: { opacity: 0, transform: 'translateY(12px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '-40%',
            top: '-35%',
            width: '120%',
            height: '2px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(60,165,111,0.4) 44%, transparent 100%)',
            transform: 'rotate(-8deg)',
            opacity: 0.3,
            animation: 'sweep 9s linear infinite',
          },
          '@keyframes sweep': {
            '0%': { transform: 'translateX(-24%) rotate(-8deg)' },
            '100%': { transform: 'translateX(34%) rotate(-8deg)' },
          },
        }}
      >
        {/* Panel head */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: '18px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              component="h3"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: 24,
                letterSpacing: '-0.01em',
                fontWeight: 700,
                color: c.textPrimary,
                m: 0,
              }}
            >
              Create Account
            </Typography>
            <Typography sx={{ mt: '6px', color: c.textTertiary, fontSize: 13 }}>
              Register to start operating in the market
            </Typography>
          </Box>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp(userData);
          }}
          sx={{ display: 'grid', gap: '16px', position: 'relative', zIndex: 1 }}
        >
          <TextField
            id="fullname"
            label="Full Name"
            placeholder="Your full name"
            autoComplete="name"
            fullWidth
            size="small"
            error={!!errors.name}
            helperText={errors.name}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={textFieldSx}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <TextField
            id="email"
            label="Email"
            placeholder="example@moneybuilder.com"
            autoComplete="email"
            fullWidth
            size="small"
            error={!!errors.email}
            helperText={errors.email}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={textFieldSx}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, email: e.target.value }))
            }
          />

          <TextField
            id="new-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            autoComplete="new-password"
            fullWidth
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => setShowPassword((v) => !v)}
                      sx={{
                        color: '#9ec1e5',
                        fontSize: 12,
                        fontWeight: 500,
                        minWidth: 'auto',
                        p: '2px 4px',
                        '&:hover': { bgcolor: 'transparent', color: '#b8d2ec' },
                      }}
                      disableRipple
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
            sx={textFieldSx}
            onChange={(e) =>
              setUserData((prev) => {
                return { ...prev, password: e.target.value };
              })
            }
          />

          <TextField
            id="confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            autoComplete="new-password"
            fullWidth
            size="small"
            error={!!errors.passwordMatch}
            helperText={errors.passwordMatch}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      sx={{
                        color: '#9ec1e5',
                        fontSize: 12,
                        fontWeight: 500,
                        minWidth: 'auto',
                        p: '2px 4px',
                        '&:hover': { bgcolor: 'transparent', color: '#b8d2ec' },
                      }}
                      disableRipple
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
            sx={textFieldSx}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <FormControlLabel
            style={{ marginLeft: '0' }}
            control={
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                size="small"
                sx={{
                  color: '#3a5270',
                  '&.Mui-checked': { color: '#3a5270' },
                  p: '2px',
                  mr: '4px',
                }}
              />
            }
            label={
              <Typography sx={{ color: c.textTertiary, fontSize: 12 }}>
                I accept the{' '}
                <Link
                  href="#"
                  underline="hover"
                  sx={{ color: '#9ec1e5', '&:hover': { color: '#b8d2ec' } }}
                >
                  terms of use
                </Link>{' '}
                and{' '}
                <Link
                  href="#"
                  underline="hover"
                  sx={{ color: '#9ec1e5', '&:hover': { color: '#b8d2ec' } }}
                >
                  privacy policy
                </Link>
              </Typography>
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!acceptTerms}
            sx={{
              height: 44,
              border: '1px solid rgba(60,165,111,0.5)',
              borderRadius: '8px',
              bgcolor: 'rgba(34,80,58,0.85)',
              color: c.textPrimary,
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.02em',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: 'rgba(44,105,75,0.9)',
                borderColor: 'rgba(60,165,111,0.7)',
                transform: 'translateY(-1px)',
                boxShadow: 'none',
              },
              '&:active': { transform: 'translateY(0)' },
              '&.Mui-disabled': {
                bgcolor: 'rgba(34,80,58,0.35)',
                color: c.textMuted,
                borderColor: 'rgba(60,165,111,0.2)',
              },
            }}
          >
            Sign Up
          </Button>
        </Box>

        {/* Login redirect footer */}
        <Box
          sx={{
            mt: '16px',
            pt: '14px',
            borderTop: '1px solid rgba(48,68,94,0.55)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography sx={{ fontSize: 12, color: c.textMuted }}>
            Already have an account?
          </Typography>
          <Link
            href="#"
            underline="hover"
            sx={{
              color: '#9ec1e5',
              fontSize: 12,
              fontWeight: 500,
              '&:hover': { color: '#b8d2ec' },
            }}
          >
            Log in
          </Link>
        </Box>
      </Paper>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          User created!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openFail}
        autoHideDuration={6000}
        onClose={handleCloseFail}
      >
        <Alert
          onClose={handleCloseFail}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Failed to create user!
        </Alert>
      </Snackbar>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function LoginPanel() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showError, setShowError] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    email: '',
    password: '',
  });
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleOpenSuccess = () => {
    setOpenSuccess(true);
  };

  const handleCloseSuccess = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSuccess(false);
  };

  async function handleLogin(userData: UserData) {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!res.ok) {
      setShowError(true);
      throw new Error('Failed to authenticate');
    }

    const data = await res.json();

    document.cookie = `tokenMoneyBuilder=${data.token}`;

    dispatch(setLoginSuccess());
    dispatch(
      setUser({
        name: data.user.name,
        email: data.user.email,
        id: data.user.id,
      }),
    );

    navigate('/dashboard', { state: { loginSuccess: true } });
  }

  return (
    <>
      <Paper
        component="section"
        aria-label="Secure login form"
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          border: `1px solid ${c.lineStrong}`,
          background:
            'linear-gradient(180deg, rgba(17,29,47,0.97) 0%, rgba(15,27,43,0.97) 100%)',
          borderRadius: '12px',
          p: { xs: '20px 16px 18px', md: '30px 30px 24px' },
          boxShadow: '0 24px 44px rgba(5,11,18,0.42)',
          animation: 'panelRise 620ms ease-out both',
          position: 'relative',
          overflow: 'hidden',
          '@keyframes panelRise': {
            from: { opacity: 0, transform: 'translateY(12px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            left: '-40%',
            top: '-35%',
            width: '120%',
            height: '2px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(95,132,175,0.6) 44%, transparent 100%)',
            transform: 'rotate(-8deg)',
            opacity: 0.35,
            animation: 'sweep 7s linear infinite',
          },
          '@keyframes sweep': {
            '0%': { transform: 'translateX(-24%) rotate(-8deg)' },
            '100%': { transform: 'translateX(34%) rotate(-8deg)' },
          },
        }}
      >
        {/* Panel head */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: '18px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              component="h3"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: 24,
                letterSpacing: '-0.01em',
                fontWeight: 700,
                color: c.textPrimary,
                m: 0,
              }}
            >
              Secure Login
            </Typography>
            <Typography sx={{ mt: '6px', color: c.textTertiary, fontSize: 13 }}>
              Enter your credentials to access the system
            </Typography>
          </Box>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(userData);
          }}
          sx={{ display: 'grid', gap: '24px', position: 'relative', zIndex: 1 }}
        >
          <TextField
            id="identifier"
            label="Email"
            placeholder="example@moneybuilder.com"
            autoComplete="username"
            fullWidth
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={textFieldSx}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, email: e.target.value }))
            }
          />

          <TextField
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            fullWidth
            size="small"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => setShowPassword((v) => !v)}
                      sx={{
                        color: '#9ec1e5',
                        fontSize: 12,
                        fontWeight: 500,
                        minWidth: 'auto',
                        p: '2px 4px',
                        '&:hover': { bgcolor: 'transparent', color: '#b8d2ec' },
                      }}
                      disableRipple
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputAdornment>
                ),
              },
            }}
            sx={textFieldSx}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: '2px',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <FormControlLabel
              style={{
                marginLeft: '0',
              }}
              control={
                <Checkbox
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  size="small"
                  sx={{
                    color: '#3a5270',
                    '&.Mui-checked': { color: '#3a5270' },
                    p: '2px',
                    mr: '4px',
                  }}
                />
              }
              label={
                <Typography sx={{ color: c.textTertiary, fontSize: 12 }}>
                  Remember this trusted device
                </Typography>
              }
            />
            <Link
              href="#"
              underline="hover"
              sx={{
                color: '#9ec1e5',
                fontSize: 12,
                '&:hover': { color: '#b8d2ec' },
              }}
            >
              Forgot password
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: '4px',
              height: 44,
              border: `1px solid ${c.ctaEdge}`,
              borderRadius: '8px',
              bgcolor: c.ctaFill,
              color: c.textPrimary,
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.02em',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#285079',
                borderColor: '#3a6a97',
                transform: 'translateY(-1px)',
                boxShadow: 'none',
              },
              '&:active': { transform: 'translateY(0)' },
            }}
          >
            Log In
          </Button>
        </Box>

        {/* Error feedback */}
        {showError && (
          <Alert
            severity="error"
            role="status"
            onClose={() => setShowError(false)}
            sx={{
              width: 'fit-content',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center' },
              mt: '12px',
              border: '1px solid rgba(191,95,95,0.55)',
              bgcolor: 'rgba(50,24,28,0.55)',
              borderRadius: '8px',
              color: '#d9b1b1',
              fontSize: 12,
              py: '4px',
              '& .MuiAlert-icon': {
                color: '#d9b1b1',
                alignItems: 'center',
              },
              '& .MuiAlert-action': {
                alignItems: 'center',
                pt: 0,
                margin: 0,
                p: 0,
              },
            }}
          >
            Authentication failed: Email or password is incorrect.
          </Alert>
        )}

        {/* Support footer */}
        <Box
          sx={{
            mt: '16px',
            pt: '14px',
            borderTop: '1px solid rgba(48,68,94,0.55)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Typography sx={{ fontSize: 12, color: c.textMuted }}>
            <Box
              component="strong"
              sx={{ color: c.textSecondary, fontWeight: 500 }}
            >
              Need help accessing your account?
            </Box>
            <br />
            Support: +55 11 4002-8899
          </Typography>
          <Link
            href="#"
            underline="hover"
            sx={{
              color: '#9ec1e5',
              fontSize: 12,
              '&:hover': { color: '#b8d2ec' },
            }}
          >
            Contact secure support
          </Link>
        </Box>
      </Paper>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Logged in successfully!
        </Alert>
      </Snackbar>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Login() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateRows: '56px 1fr',
        bgcolor: c.bgBase,
        color: c.textPrimary,
        fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: '56px 0 0 0',
          background:
            'linear-gradient(100deg, rgba(11,21,36,0.9) 8%, rgba(11,21,36,0.74) 42%, rgba(11,21,36,0.88) 88%)',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <TopBar />

      {/*
       * 12-column grid (desktop) / 4-column grid (mobile)
       * LoginPanel  → md: 7 cols  |  xs: 4 cols (full width)
       * ContextPanel → md: 5 cols  |  xs: 4 cols (full width, stacks below)
       */}
      <Grid
        container
        zIndex={1}
        sx={{
          px: { xs: 4 },
          pt: 2,
          pb: 8,
          justifyContent: 'center',
          margin: 'auto 20%',
        }}
        spacing={4}
      >
        <Grid size={{ lg: 7, md: 12, sm: 12 }}>
          <LoginPanel />
        </Grid>
        <Grid
          mt={{ md: 4, sm: 2, xs: 3, lg: 0 }}
          size={{ lg: 5, md: 12, sm: 12 }}
        >
          <SignInPanel />
        </Grid>
      </Grid>
      {/* <div
        style={{
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          margin: 'auto',
          columnGap: 24,
        }}
      ></div> */}
    </Box>
  );
}
