import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './shared/ui/components/Sidebar';
import Navbar from './shared/ui/components/Navbar';

const AppLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box display="flex" minHeight="100vh" bgcolor="background.default">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        <Navbar onSearch={setSearchQuery} />
        <Box
          component="main"
          flex={1}
          sx={{ overflowY: 'auto', bgcolor: 'background.default' }}
        >
          {/* This will render DashboardHome, JobListings, etc. based on the route */}
          <Outlet context={{ activeSection, searchQuery }} />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
