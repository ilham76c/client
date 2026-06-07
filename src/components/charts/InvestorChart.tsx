'use client';

import { EChartsOption } from 'echarts';
import { BaseChart } from './BaseChart';

interface InvestorChartProps {
  title?: string;
  data?: { name: string; value: number }[];
  loading?: boolean;
  height?: number;
}

/**
 * Investor chart component for displaying investor distribution
 */
export const InvestorChart = ({
  title = 'Investor Distribution',
  data = [],
  loading = false,
  height = 400,
}: InvestorChartProps) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        data: data.map((d) => ({ name: d.name, value: d.value })),
        type: 'pie',
      },
    ],
  };

  return <BaseChart title={title} option={option} height={height} loading={loading} />;
};