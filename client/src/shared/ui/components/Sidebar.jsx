import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardOutlinedIcon },
  { id: 'jobs', label: 'Jobs', icon: WorkOutlineIcon, badge: 'New' },
  { id: 'applications', label: 'Applications', icon: DescriptionOutlinedIcon, badge: '8' },
  { id: 'saved', label: 'Saved Jobs', icon: BookmarkBorderIcon, badge: '24' },
  { id: 'profile', label: 'Profile', icon: PersonOutlineIcon },
  { id: 'settings', label: 'Settings', icon: SettingsOutlinedIcon },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNavigation = (id) => {
    if (id === 'dashboard') navigate('/dashboard');
    else navigate(`/dashboard/${id}`);
  };

  // Determine active section from URL
  const activeSection = location.pathname.split('/').pop() === 'dashboard' ? 'dashboard' : location.pathname.split('/').pop();

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography
          variant="h6"
          fontWeight={700}
          color="primary.main"
          letterSpacing={-0.5}
        >
          LocalHire
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Jobs Portal
        </Typography>
      </Box>

      {/* User Profile Summary */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            src={`https://ui-avatars.com/api/?name=${user?.name || user?.companyName || 'User'}&background=random`}
            sx={{ width: 36, height: 36 }}
          />
          <Box>
            <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
              {user?.name || user?.companyName || 'Loading...'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {user?.role || 'User'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        <Typography
          variant="overline"
          color="text.disabled"
          sx={{ px: 3, pt: 1.5, pb: 0.5, display: 'block', fontSize: '0.65rem', letterSpacing: 1.2 }}
        >
          Menu
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.id)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                      '&:hover': { bgcolor: 'primary.100' },
                    },
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: isActive ? 600 : 400 }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: isActive ? 'primary.main' : 'grey.200',
                        color: isActive ? 'white' : 'text.secondary',
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <ListItemButton
          onClick={() => logout()}
          sx={{
            borderRadius: 2,
            py: 1,
            px: 1.5,
            color: 'text.secondary',
            '&:hover': { bgcolor: 'error.50', color: 'error.main', '& .MuiListItemIcon-root': { color: 'error.main' } },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;