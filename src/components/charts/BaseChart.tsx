'use client';

import { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Card } from '../ui/Card';

interface BaseChartProps {
  title?: string;
  option: EChartsOption;
  height?: number;
  loading?: boolean;
}

/**
 * Base chart component wrapper
 */
export const BaseChart = ({ title, option, height = 400, loading = false }: BaseChartProps) => {
  return (
    <Card title={title} sx={{ height: 'fit-content' }}>
      <ReactECharts option={option} style={{ height: `${height}px` }} loading={loading} />
    </Card>
  );
};