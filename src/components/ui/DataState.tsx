'use client';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';

type StateType = 'loading' | 'empty' | 'error';

interface Props {
  state: StateType;

  title?: string;

  message?: string;

  onRetry?: () => void;
}

export default function DataState({ state, title, message, onRetry }: Props) {
  if (state === 'loading') {
    return (
      <Box
        sx={{
          py: 8,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (state === 'empty') {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography variant='h6' gutterBottom>
          {title ?? 'No Data Available'}
        </Typography>

        <Typography color='text.secondary'>
          {message ?? 'No records found.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Alert
      severity='warning'
      sx={{
        borderRadius: 2,
      }}
    >
      <AlertTitle>{title ?? 'Unable to Load Data'}</AlertTitle>

      {message ?? 'Something went wrong while loading data.'}

      {onRetry && (
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Button size='small' variant='outlined' onClick={onRetry}>
            Retry
          </Button>
        </Box>
      )}
    </Alert>
  );
}
