'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';
import { Footer } from '../common/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main layout with header, sidebar, and footer
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};