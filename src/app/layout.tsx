'use client';

// @ts-ignore: side-effect import for global CSS
import './globals.css';

import { useState } from 'react';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@/lib/config/muiTheme';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function RootLayout({
  children,
}: any) {

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>

          <ThemeProvider theme={darkTheme}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
            >
              {children}
            </LocalizationProvider>
          </ThemeProvider>

        </QueryClientProvider>
      </body>
    </html>
  );
}