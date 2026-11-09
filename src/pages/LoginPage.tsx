import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useNotifier } from '../components/Notifier';
import { forgotPassword, loginUser, registerUser } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getErrorMessage } from '../utils/helpers';
import {
  validateConfirmPassword,
  validateEmail,
  validateEmailOrMobile,
  validateMobile,
  validatePassword,
  validateRequired,
} from '../utils/validators';

type Errors = Record<string, string>;

// Screen 1: Login / Registration
export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notify } = useNotifier();
  const user = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.status === 'loading');

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const [login, setLogin] = useState({ identifier: '', password: '' });
  const [register, setRegister] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });

  // Forgot password popup
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Already logged in? Go straight to Home.
  if (user) return <Navigate to="/" replace />;

  const changeTab = (_event: unknown, value: 'login' | 'register') => {
    setTab(value);
    setErrors({});
    setFormError('');
  };

  const clearError = (name: string) => {
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const hasErrors = (found: Errors) => Object.values(found).some((message) => message !== '');

  // ---------- LOGIN ----------
  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [event.target.name]: event.target.value });
    clearError(event.target.name);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const found: Errors = {
      identifier: validateEmailOrMobile(login.identifier),
      password: login.password === '' ? 'Password is required' : '',
    };
    setErrors(found);
    if (hasErrors(found) || isLoading) return;

    setFormError('');
    try {
      await dispatch(loginUser({ identifier: login.identifier, password: login.password })).unwrap();
      notify('Login successful. Welcome back!', 'success');
      navigate('/', { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
      notify(getErrorMessage(error), 'error');
    }
  };

  // ---------- REGISTER ----------
  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    let { value } = event.target;
    if (name === 'mobile') value = value.replace(/\D/g, '').slice(0, 10);
    setRegister({ ...register, [name]: value });
    clearError(name);
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    const found: Errors = {
      name: validateRequired(register.name, 'Name'),
      email: validateEmail(register.email),
      mobile: validateMobile(register.mobile),
      password: validatePassword(register.password),
      confirmPassword: validateConfirmPassword(register.password, register.confirmPassword),
    };
    setErrors(found);
    if (hasErrors(found) || isLoading) return;

    setFormError('');
    try {
      await dispatch(
        registerUser({ name: register.name, email: register.email, mobile: register.mobile, password: register.password }),
      ).unwrap();
      notify('Account created successfully. Please log in.', 'success');
      setLogin({ identifier: register.email, password: '' });
      setRegister({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
      setTab('login');
    } catch (error) {
      setFormError(getErrorMessage(error));
      notify(getErrorMessage(error), 'error');
    }
  };

  // ---------- FORGOT PASSWORD ----------
  const handleForgot = async () => {
    const message = validateEmail(forgotEmail);
    setForgotError(message);
    if (message) return;
    try {
      await dispatch(forgotPassword(forgotEmail)).unwrap();
      // This is a demo: no real e-mail is sent, and we say so.
      notify('Demo mode: the account exists, but no real e-mail is sent.', 'info');
      setForgotOpen(false);
      setForgotEmail('');
    } catch (error) {
      setForgotError(getErrorMessage(error));
    }
  };

  // A password field with the show / hide eye button.
  const passwordField = (
    name: string,
    label: string,
    value: string,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
  ) => (
    <TextField
      name={name}
      label={label}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      error={Boolean(errors[name])}
      helperText={errors[name]}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="show or hide password">
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  const submitLabel = (text: string) =>
    isLoading ? <CircularProgress size={24} color="inherit" /> : text;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(135deg, #fff3e6 0%, #ffe0c2 100%)',
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 460, p: { xs: 2.5, sm: 4 } }} elevation={4}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Logo />
        </Box>
        <Typography variant="h5" fontWeight={700} align="center">
          {tab === 'login' ? 'Welcome back!' : 'Create your account'}
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 2 }}>
          {tab === 'login' ? 'Log in to order your favourite food' : 'Register to start ordering'}
        </Typography>

        <Tabs value={tab} onChange={changeTab} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Login" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        {tab === 'login' ? (
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="identifier"
              label="Email or mobile number"
              value={login.identifier}
              onChange={handleLoginChange}
              error={Boolean(errors.identifier)}
              helperText={errors.identifier}
              fullWidth
              autoComplete="username"
            />
            {passwordField('password', 'Password', login.password, handleLoginChange)}
            <Box sx={{ textAlign: 'right' }}>
              <Link component="button" type="button" underline="hover" onClick={() => setForgotOpen(true)}>
                Forgot password?
              </Link>
            </Box>
            <Button type="submit" variant="contained" size="large" disabled={isLoading}>
              {submitLabel('Login')}
            </Button>
            <Alert severity="info">
              Demo account: <b>demo@food.com</b> / <b>Demo@123</b>
            </Alert>
            <Typography align="center" variant="body2">
              New here?{' '}
              <Link component="button" type="button" underline="hover" onClick={() => changeTab(null, 'register')}>
                Create account
              </Link>
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegister} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Full name"
              value={register.name}
              onChange={handleRegisterChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              value={register.email}
              onChange={handleRegisterChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
            />
            <TextField
              name="mobile"
              label="Mobile number"
              value={register.mobile}
              onChange={handleRegisterChange}
              error={Boolean(errors.mobile)}
              helperText={errors.mobile}
              inputProps={{ inputMode: 'numeric', maxLength: 10 }}
              fullWidth
            />
            {passwordField('password', 'Password', register.password, handleRegisterChange)}
            {passwordField('confirmPassword', 'Confirm password', register.confirmPassword, handleRegisterChange)}
            <Button type="submit" variant="contained" size="large" disabled={isLoading}>
              {submitLabel('Create account')}
            </Button>
            <Typography align="center" variant="body2">
              Already have an account?{' '}
              <Link component="button" type="button" underline="hover" onClick={() => changeTab(null, 'login')}>
                Login
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>

      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Forgot password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Enter your registered email address.</DialogContentText>
          <TextField
            label="Email"
            value={forgotEmail}
            onChange={(event) => {
              setForgotEmail(event.target.value);
              setForgotError('');
            }}
            error={Boolean(forgotError)}
            helperText={forgotError}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={() => setForgotOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleForgot} disabled={isLoading}>
            {submitLabel('Send reset link')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
