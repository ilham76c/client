'use client';

import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Layout for dashboard pages
 */
export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Container
          maxWidth="lg"
          component="main"
          sx={{
            py: 4,
            flex: 1,
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};