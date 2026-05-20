import React from 'react';
import { createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import LoginPage from './shared/auth/pages/LoginPage';
import RegisterPage from './shared/auth/pages/RegisterPage';
import ProtectedRoute from './shared/auth/components/ProtectedRoute';
import AppLayout from './AppLayout';
import DashboardHome from './aspirant/dashboard/pages/DashboardHome';
import CompanyDashboard from './organization/dashboard/pages/CompanyDashboard';
import JobListings from './aspirant/jobs/pages/JobListings';
import ProfileForm from './aspirant/profile/pages/ProfileForm';
import CompanyProfile from './organization/profile/pages/CompanyProfile';
import { Crisp } from "crisp-sdk-web";

// ── MUI Theme ───────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2',
      light: '#42A5F5',
      dark: '#1565C0',
      50: '#E3F2FD',
      100: '#BBDEFB',
    },
    background: {
      default: '#F8F9FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    divider: '#E5E7EB',
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h4: { fontWeight: 700, letterSpacing: -0.5 },
    h5: { fontWeight: 700, letterSpacing: -0.5 },
    h6: { fontWeight: 700, letterSpacing: -0.3 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

// A small component to handle redirection if user is already logged in
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// Dashboard routing based on user role
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  return user?.role === 'company' ? <CompanyDashboard /> : <DashboardHome />;
};

// Profile routing based on user role
const RoleBasedProfile = () => {
  const { user } = useAuth();
  return user?.role === 'company' ? <CompanyProfile /> : <ProfileForm />;
};

// ── App ──────────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<RoleBasedDashboard />} />
                <Route path="/dashboard/jobs" element={<JobListings />} />
                <Route path="/dashboard/applications" element={<Box p={4} textAlign="center">My Applications - Coming Soon</Box>} />
                <Route path="/dashboard/saved" element={<Box p={4} textAlign="center">Saved Jobs - Coming Soon</Box>} />
                <Route path="/dashboard/profile" element={<RoleBasedProfile />} />
                <Route path="/dashboard/profile/:userid" element={<RoleBasedProfile />} />
                <Route path="/dashboard/settings" element={<Box p={4} textAlign="center">Settings - Coming Soon</Box>} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;