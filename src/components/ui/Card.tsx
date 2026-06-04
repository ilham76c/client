'use client';

import { ReactNode } from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardHeader } from '@mui/material';

interface CardProps extends MuiCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Reusable Card component with optional header
 */
export const Card = ({ title, subtitle, children, ...props }: CardProps) => {
  return (
    <MuiCard {...props}>
      {title && <CardHeader title={title} subheader={subtitle} />}
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};