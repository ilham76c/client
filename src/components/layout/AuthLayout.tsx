'use client';

import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Layout for authentication pages (login, register)
 */
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ py: 4 }}>{children}</Box>
      </Container>
    </Box>
  );
};