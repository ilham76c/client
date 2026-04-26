'use client';

// @ts-ignore: side-effect import for global CSS
import "./globals.css";
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@/lib/muiTheme';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <ThemeProvider theme={darkTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {children}
          </LocalizationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}