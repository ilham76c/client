'use client';

import ReactECharts from 'echarts-for-react';
import { OwnershipRow } from '@/features/ownership/types';
import { buildStackedLineByInvestorType } from '../utils/ownershipSeries';

type Props = {
  data: OwnershipRow[];
};

export default function OwnershipChart({ data }: Props) {
  const { series, legend, xAxisData } = buildStackedLineByInvestorType(data);

  const option = {
    backgroundColor: '#ffffff',
    title: {
      text: 'Daily Ownership Changes',
    },
    // tooltip: {
    //   trigger: 'axis'
    // },
    legend: {
      data: legend,
      bottom: 20, // posisi legend
      left: 'center',
      orient: 'horizontal',
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
    },
    // yAxis: {
    //   type: 'value'
    // },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: (v) => v.toLocaleString(),
      },
    },
    series: series,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
      formatter: (params: any[]) => {
        if (!params.length) return '';

        const date = params[0].axisValue;

        let html = `<div style="font-weight:600;margin-bottom:4px">${date}</div>`;

        params.forEach((p) => {
          const change = p.data?.change ?? 0;
          const sign = change > 0 ? '+' : '';

          html += `
            <div style="display:flex;align-items:center;gap:6px">
              <span style="
                display:inline-block;
                width:10px;
                height:10px;
                border-radius:50%;
                background:${p.color};
              "></span>
              <span>${p.seriesName}</span>
              <span style="margin-left:auto;font-weight:600">
                ${sign}${change.toLocaleString()}
              </span>
            </div>
          `;
        });

        return html;
      },
    },
  };

  return (
    <ReactECharts option={option} style={{ height: '95%', width: '100%' }} />
  );
}
