'use client';

import { Card } from '@/components/ui/Card';
import { Box, Typography } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

/**
 * Summary card component for dashboard
 */
export const SummaryCard = ({ title, value, icon, color = '#1976d2' }: SummaryCardProps) => {
  return (
    <Card sx={{ minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ color, fontSize: 32, mb: 1 }}>
          {icon}
        </Box>
        <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
          {value}
        </Typography>
      </Box>
    </Card>
  );
};