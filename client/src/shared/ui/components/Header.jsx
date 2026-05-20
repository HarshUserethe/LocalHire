import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import LoginForm from '../../auth/components/LoginForm';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#ffffff',
  color: '#333',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  borderBottom: '1px solid #e0e0e0',
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '24px',
  backgroundColor: alpha('#384BFF', 0.08),
  '&:hover': {
    backgroundColor: alpha('#384BFF', 0.15),
  },
  marginRight: theme.spacing(1),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  transition: theme.transitions.create(['width', 'background-color'], {
    duration: 300,
  }),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Logo = styled(Typography)({
  fontSize: '1.4rem',
  fontWeight: 800,
  letterSpacing: '-0.5px',
  cursor: 'pointer',
  '& span': {
    color: '#ff8a00',
  },
});

const NavItem = styled('li')({
  fontWeight: 500,
  fontSize: '0.95rem',
  color: '#666',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  padding: '8px 12px',
  borderRadius: '8px',
  '&:hover': {
    color: '#384BFF',
    backgroundColor: 'rgba(56, 75, 255, 0.05)',
  },
});

const LoginButton = styled(IconButton)({
  color: '#333',
  padding: '8px 16px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#384BFF',
    backgroundColor: 'rgba(56, 75, 255, 0.05)',
    color: '#384BFF',
  },
});

const RegisterButton = styled(IconButton)({
  padding: '8px 20px',
  borderRadius: '8px',
  backgroundColor: '#384BFF',
  color: '#fff',
  border: 'none',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#192bc2',
  },
});

const Header = () => {
  const navigate = useNavigate();
  const [openTab, setOpenTab] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleOpenTab = () => setOpenTab(true);
  const handleCloseTab = () => setOpenTab(false);
  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  return (
    <div>
      {/* Notification Panel */}
      <div
        className="notificationTab"
        style={{
          right: openTab ? '0%' : '-25%',
          zIndex: 1000,
          position: 'absolute',
          top: '70px',
          width: '320px',
          background: '#fff',
          borderLeft: '1px solid #e0e0e0',
          boxShadow: '-2px 4px 12px rgba(0,0,0,0.1)',
          transition: 'right 0.3s ease',
        }}
      >
        <div className="notifications" style={{ padding: '12px' }}>
          <div
            className="lable"
            style={{
              fontSize: '1rem',
              padding: '12px',
              fontWeight: 500,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#666',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          >
            <span>Notifications</span>
            <span>
              <CloseIcon onClick={handleCloseTab} style={{ cursor: 'pointer', color: '#666' }} />
            </span>
          </div>

          <div
            className="notification-items"
            style={{
              padding: '14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>New job matches</span>
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '6px' }}>
              Several new jobs match your profile. Check them out!
            </div>
          </div>
        </div>
      </div>

      <StyledAppBar position="sticky">
        <Toolbar
          sx={{
            height: '70px',
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
            px: { xs: 2, md: 3 },
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box component="div" sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Logo variant="h6" onClick={() => navigate('/')}>
              LOCAL<span>HIRE</span>
            </Logo>
          </Box>

          {/* Navigation - Desktop */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: { xs: 1, md: 3 },
              ml: 4,
            }}
          >
            <NavItem>Prepare</NavItem>
            <NavItem>Participants</NavItem>
            <NavItem>Opportunities</NavItem>
          </Box>

          {/* Search */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              maxWidth: 320,
              mx: 'auto',
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search jobs..."
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Notifications */}
            <IconButton color="inherit" onClick={handleOpenTab} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon sx={{ fontSize: '1.5rem' }} />
              </Badge>
            </IconButton>

            {/* Login */}
            <LoginButton onClick={handleLoginOpen}>Login</LoginButton>

            {/* Register */}
            <RegisterButton onClick={handleLoginOpen}>Register</RegisterButton>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton aria-label="show more" color="inherit">
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Login Modal */}
      <LoginForm handleClose={handleLoginClose} open={loginOpen} />
    </div>
  );
};

export default Header;