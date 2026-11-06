import * as React from 'react';
import { Chart, ChartProps, ChartType } from '../lib/common/Chart';

const chartSamples: Array<{
  type: ChartType;
  title: string;
  data?: ChartProps['data'];
  series?: ChartProps['series'];
  labels?: string[];
  value?: number;
  min?: number;
  max?: number;
}> = [
  { type: 'bar', title: 'Bar', series: [{ label: 'This year', data: [18, 30, 23, 38] }, { label: 'Last year', data: [12, 21, 28, 25] }] },
  { type: 'line', title: 'Line', data: [14, 28, 20, 34, 27] },
  { type: 'area', title: 'Area', data: [12, 22, 18, 35, 29] },
  { type: 'donut', title: 'Donut', data: [38, 27, 21, 14] },
  { type: 'scatter', title: 'Scatter', series: [{ data: [{ x: 1, y: 12 }, { x: 2, y: 28 }, { x: 3, y: 20 }, { x: 4, y: 35 }] }] },
  { type: 'sparkline', title: 'Sparkline', data: [10, 16, 13, 25, 20, 30, 24] },
  { type: 'gauge', title: 'Gauge', value: 72, min: 0, max: 100 },
  { type: 'radar', title: 'Radar', labels: ['Speed', 'Power', 'Range', 'Control', 'Safety'], series: [{ label: 'Model A', data: [82, 65, 75, 58, 90] }, { label: 'Model B', data: [62, 86, 68, 80, 72] }] },
  { type: 'heatmap', title: 'Heatmap', data: [[2, 4, 7, 3], [5, 8, 3, 6], [1, 5, 9, 4]] },
  { type: 'funnel', title: 'Funnel', data: [100, 76, 52, 31, 14] },
  { type: 'pyramid', title: 'Pyramid', data: [100, 76, 52, 31, 14] },
  { type: 'rangeBar', title: 'Range bar', data: [{ label: 'Task A', low: 12, high: 48 }, { label: 'Task B', low: 30, high: 75 }, { label: 'Task C', low: 5, high: 56 }] },
  {
    type: 'candlestick',
    title: 'Candlestick',
    data: [
      { low: 12, high: 34, open: 18, close: 28 },
      { low: 16, high: 38, open: 30, close: 21 },
      { low: 14, high: 32, open: 21, close: 27 },
      { low: 20, high: 42, open: 27, close: 37 },
    ],
  },
];

export function ChartShowcase({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <section aria-label="Chart examples" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <strong style={{ fontSize: 13, fontWeight: 600 }}>Charts</strong>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
        {chartSamples.map(({ type, title, ...props }) => (
          <div key={type} style={{ minWidth: 0, padding: '10px 12px 8px', border: '1px solid color-mix(in srgb, currentColor 14%, transparent)', borderRadius: 8, background: 'color-mix(in srgb, currentColor 3%, transparent)' }}>
            <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, opacity: .75 }}>{title}</div>
            <Chart {...props} type={type} theme={theme} width={300} height={130} aria-label={`${title} chart example`} />
          </div>
        ))}
      </div>
    </section>
  );
}
