'use client';

import { EChartsOption } from 'echarts';
import { BaseChart } from './BaseChart';

interface FinancialChartProps {
  title?: string;
  data?: { name: string; value: number }[];
  loading?: boolean;
  height?: number;
}

/**
 * Financial chart component for displaying financial data
 */
export const FinancialChart = ({
  title = 'Financial Overview',
  data = [],
  loading = false,
  height = 400,
}: FinancialChartProps) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data.map((d) => d.value),
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#1976d2',
        },
      },
    ],
  };

  return <BaseChart title={title} option={option} height={height} loading={loading} />;
};