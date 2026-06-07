'use client';

import { ReactNode } from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'children'> {
  children: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

/**
 * Reusable Button component
 */
export const Button = ({
  children,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  variant = 'contained',
  ...props
}: ButtonProps) => {
  return (
    <MuiButton
      variant={variant}
      disabled={isLoading || disabled}
      fullWidth={fullWidth}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </MuiButton>
  );
};