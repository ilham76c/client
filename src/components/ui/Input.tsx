'use client';

import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends TextFieldProps {
  error?: boolean;
  errorMessage?: string;
}

/**
 * Reusable Input component
 */
export const Input = ({ error = false, errorMessage, helperText, ...props }: InputProps) => {
  return (
    <TextField
      fullWidth
      error={error}
      helperText={error ? errorMessage : helperText}
      {...props}
    />
  );
};