'use client';

import { Box, CircularProgress, CircularProgressProps } from '@mui/material';

interface LoadingSpinnerProps extends CircularProgressProps {
  fullScreen?: boolean;
}

/**
 * Loading spinner component
 */
export const LoadingSpinner = ({ fullScreen = false, ...props }: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <CircularProgress {...props} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
      <CircularProgress {...props} />
    </Box>
  );
};