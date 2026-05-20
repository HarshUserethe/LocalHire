import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  InputBase,
  IconButton,
  Badge,
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onSearch }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const open = Boolean(anchorEl);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 64 } }}>
        {/* Search */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            maxWidth: 480,
            px: 1.5,
            py: 0.5,
            bgcolor: 'grey.50',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            '&:focus-within': {
              borderColor: 'primary.main',
              bgcolor: 'background.paper',
              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.08)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <SearchIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search jobs, companies..."
            fullWidth
            onChange={(e) => onSearch && onSearch(e.target.value)}
            sx={{ fontSize: '0.875rem' }}
          />
        </Paper>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="medium"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main', bgcolor: 'primary.50' },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="Account">
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              onClick={handleOpenMenu}
              sx={{
                cursor: 'pointer',
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                '&:hover': { bgcolor: 'grey.100' },
                transition: 'background 0.15s',
              }}
            >
              <Avatar
                src={`https://ui-avatars.com/api/?name=${user?.name || user?.companyName || 'User'}&background=random`}
                sx={{ width: 32, height: 32 }}
              />
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                  {user?.name || user?.companyName || 'Loading...'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {user?.role || 'User'}
                </Typography>
              </Box>
            </Box>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 2,
              sx: { mt: 1, minWidth: 180, borderRadius: 2, border: '1px solid', borderColor: 'divider' },
            }}
          >
            <MenuItem onClick={handleCloseMenu} sx={{ gap: 1.5, py: 1 }}>
              <ListItemIcon><PersonOutlineIcon fontSize="small" /></ListItemIcon>
              <Typography variant="body2">My Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseMenu} sx={{ gap: 1.5, py: 1 }}>
              <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleCloseMenu(); logout(); }} sx={{ gap: 1.5, py: 1, color: 'error.main' }}>
              <ListItemIcon><LogoutOutlinedIcon fontSize="small" color="error" /></ListItemIcon>
              <Typography variant="body2" color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;