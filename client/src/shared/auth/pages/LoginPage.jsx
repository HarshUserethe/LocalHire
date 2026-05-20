import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Alert,
  Fade,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const LoginPage = () => {
  const [role, setRole] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleChange = (_, newValue) => {
    if (newValue) setRole(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Left Panel — branding (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '42%',
          flexShrink: 0,
          bgcolor: 'primary.main',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background circles */}
        <Box sx={{
          position: 'absolute', width: 320, height: 320, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)', top: -80, right: -80,
        }} />
        <Box sx={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)', top: 60, right: 60,
        }} />
        <Box sx={{
          position: 'absolute', width: 280, height: 280, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)', bottom: -60, left: -60,
        }} />

        {/* Brand */}
        <Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <WorkOutlineIcon sx={{ color: 'white', fontSize: 28 }} />
            <Typography variant="h5" fontWeight={700} color="white" letterSpacing={-0.5}>
              LocalHire
            </Typography>
          </Box>
        </Box>

        {/* Headline */}
        <Box>
          <Typography
            variant="h3"
            fontWeight={700}
            color="white"
            letterSpacing={-1}
            lineHeight={1.2}
            mb={2}
          >
            Find jobs that{' '}
            <Box component="span" sx={{ opacity: 0.7 }}>
              match your potential.
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.7 }}>
            Join thousands of professionals discovering local opportunities tailored to their skills and ambitions.
          </Typography>
        </Box>

        {/* Stats row */}
        <Box display="flex" gap={4}>
          {[['12k+', 'Active Jobs'], ['4.2k', 'Companies'], ['98%', 'Placement Rate']].map(([val, label]) => (
            <Box key={label}>
              <Typography variant="h6" fontWeight={700} color="white">{val}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Panel — form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile brand */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 4 }}>
            <WorkOutlineIcon color="primary" />
            <Typography variant="h6" fontWeight={700} color="primary" letterSpacing={-0.5}>
              LocalHire
            </Typography>
          </Box>

          {/* Heading */}
          <Box mb={4}>
            <Typography variant="h5" fontWeight={700} letterSpacing={-0.5} gutterBottom>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue your job search
            </Typography>
          </Box>

          {/* Role Toggle */}
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            fullWidth
            sx={{
              mb: 3.5,
              bgcolor: 'grey.100',
              borderRadius: 2,
              p: 0.5,
              '& .MuiToggleButtonGroup-grouped': {
                border: 0,
                borderRadius: '8px !important',
                mx: 0,
                py: 1,
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'none',
                color: 'text.secondary',
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: 'background.paper' },
                },
                '&:hover': { bgcolor: 'transparent' },
              },
            }}
          >
            <ToggleButton value="employee" disableRipple>
              <PersonOutlineIcon sx={{ fontSize: 17, mr: 0.75 }} />
              Job Seeker
            </ToggleButton>
            <ToggleButton value="company" disableRipple>
              <BusinessCenterOutlinedIcon sx={{ fontSize: 17, mr: 0.75 }} />
              Company
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Error */}
          <Fade in={Boolean(error)}>
            <Box mb={error ? 2.5 : 0}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.82rem' }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Fade>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box mb={2}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.75} display="block">
                Email Address
              </Typography>
              <TextField
                fullWidth
                placeholder={role === 'employee' ? 'you@example.com' : 'contact@company.com'}
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                    '&.Mui-focused': { bgcolor: 'background.paper' },
                  },
                }}
              />
            </Box>

            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">
                  Password
                </Typography>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  underline="hover"
                  sx={{ fontSize: '0.75rem', color: 'primary.main', fontWeight: 500 }}
                >
                  Forgot password?
                </Link>
              </Box>
              <TextField
                fullWidth
                placeholder="Enter your password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                        sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}
                      >
                        {showPassword
                          ? <VisibilityOffOutlinedIcon sx={{ fontSize: 17 }} />
                          : <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                    '&.Mui-focused': { bgcolor: 'background.paper' },
                  },
                }}
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              disableElevation
              sx={{
                py: 1.4,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' },
              }}
            >
              {isSubmitting
                ? <CircularProgress size={20} color="inherit" />
                : `Sign in as ${role === 'employee' ? 'Job Seeker' : 'Company'}`}
            </Button>
          </Box>

          {/* Divider */}
          <Box display="flex" alignItems="center" gap={1.5} my={3}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.disabled" fontWeight={500}>OR</Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Register link */}
          <Box
            sx={{
              textAlign: 'center',
              py: 1.75,
              px: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'grey.50',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to={`/register?role=${role}`}
                underline="hover"
                sx={{ color: 'primary.main', fontWeight: 600 }}
              >
                Create one for free
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;