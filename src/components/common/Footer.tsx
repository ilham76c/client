'use client';

import { Box, Container, Typography, Link as MuiLink } from '@mui/material';

/**
 * Footer component
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          © {currentYear} EquityLens. All rights reserved.
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
          <MuiLink href="#" color="inherit" underline="hover">
            Privacy Policy
          </MuiLink>
          {' | '}
          <MuiLink href="#" color="inherit" underline="hover">
            Terms of Service
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
};