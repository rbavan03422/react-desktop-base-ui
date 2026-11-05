import * as React from 'react';
import { cx } from './index';

export type ChartType =
  | 'bar' | 'line' | 'area' | 'donut' | 'scatter' | 'sparkline' | 'gauge'
  | 'radar' | 'heatmap' | 'funnel' | 'pyramid' | 'rangeBar' | 'candlestick';

export interface ChartDatum {
  x?: string | number;
  y?: number;
  value?: number;
  label?: string;
  low?: number;
  high?: number;
  open?: number;
  close?: number;
}

export interface ChartSeries {
  label?: string;
  data: Array<number | ChartDatum>;
  color?: string;
}

export interface ChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  type: ChartType;
  data?: Array<number | ChartDatum> | number[][];
  series?: ChartSeries[];
  labels?: string[];
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  value?: number;
  colors?: string[];
  showGrid?: boolean;
  theme?: 'light' | 'dark';
}

type Point = ChartDatum & { y: number };
type NormalizedSeries = { label: string; color?: string; points: Point[] };

const PALETTE = [
  'var(--rd-chart-1)', 'var(--rd-chart-2)', 'var(--rd-chart-3)',
  'var(--rd-chart-4)', 'var(--rd-chart-5)', 'var(--rd-chart-6)',
];

function normalizePoint(point: number | ChartDatum, index: number, labels?: string[]): Point {
  if (typeof point === 'number') return { x: labels?.[index] ?? index, label: labels?.[index], y: point };
  return {
    ...point,
    x: point.x ?? point.label ?? labels?.[index] ?? index,
    label: point.label ?? labels?.[index] ?? String(point.x ?? index),
    y: point.y ?? point.value ?? point.high ?? point.close ?? 0,
  };
}

function arcPath(cx: number, cy: number, radius: number, start: number, end: number): string {
  const x1 = cx + radius * Math.cos(start);
  const y1 = cy + radius * Math.sin(start);
  const x2 = cx + radius * Math.cos(end);
  const y2 = cy + radius * Math.sin(end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function curvePath(cx: number, cy: number, radius: number, start: number, end: number): string {
  const steps = Math.max(1, Math.ceil((end - start) * 24));
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = start + ((end - start) * index) / steps;
    const command = index === 0 ? 'M' : 'L';
    return `${command} ${cx + radius * Math.cos(angle)} ${cy + radius * Math.sin(angle)}`;
  }).join(' ');
}

function numberRange(values: number[], min?: number, max?: number) {
  const low = min ?? Math.min(0, ...values);
  const high = max ?? Math.max(1, ...values);
  return { min: low, max: high === low ? low + 1 : high };
}

interface ChartCoreProps extends ChartProps {
  classPrefix: string;
  rootClassName: string;
}

const ChartCore = React.forwardRef<HTMLDivElement, ChartCoreProps>(
  function ChartCore(
    {
      type, data = [], series, labels, width = 360, height = 220, min, max,
      value, colors, showGrid = true, className, classPrefix, rootClassName,
      theme, ...rootProps
    },
    ref,
  ) {
    const palette = colors?.length ? colors : PALETTE;
    const chartSeries: NormalizedSeries[] = series?.length
      ? series.map((item, index) => ({
          label: item.label ?? `Series ${index + 1}`,
          color: item.color,
          points: item.data.map((point, pointIndex) => normalizePoint(point, pointIndex, labels)),
        }))
      : Array.isArray(data[0])
        ? []
        : [{ label: 'Series 1', points: (data as Array<number | ChartDatum>).map((point, index) => normalizePoint(point, index, labels)) }];

    const defaultLabel = `${type} chart`;
    const common = { className: `${classPrefix}__svg`, viewBox: `0 0 ${width} ${height}`, role: 'img' as const };
    const colorAt = (index: number) => palette[index % palette.length];
    const seriesColor = (item: NormalizedSeries, index: number) => item.color ?? colorAt(index);
    const plot = type === 'sparkline'
      ? { left: 4, right: width - 4, top: 4, bottom: height - 4 }
      : { left: 34, right: width - 12, top: 14, bottom: height - 28 };
    const plotWidth = plot.right - plot.left;
    const plotHeight = plot.bottom - plot.top;
    const allValues = chartSeries.flatMap((item) => item.points.map((point) => point.y));
    const range = numberRange(allValues, min, max);
    const yAt = (v: number) => plot.bottom - ((v - range.min) / (range.max - range.min)) * plotHeight;
    const xAt = (index: number, count: number) => plot.left + (count <= 1 ? plotWidth / 2 : (index * plotWidth) / (count - 1));
    const grid = showGrid && type !== 'sparkline' ? (
      <g className={`${classPrefix}__grid`} aria-hidden>
        {[0, 1, 2, 3].map((step) => {
          const y = plot.top + (plotHeight * step) / 3;
          return <line key={step} x1={plot.left} x2={plot.right} y1={y} y2={y} />;
        })}
      </g>
    ) : null;

    let chart: React.ReactNode;
    let accessibleLabel = defaultLabel;

    if (type === 'bar' || type === 'line' || type === 'area' || type === 'sparkline') {
      const count = Math.max(0, ...chartSeries.map((item) => item.points.length));
      const zeroY = yAt(0);
      if (type === 'bar') {
        const groupWidth = plotWidth / Math.max(1, count);
        const barWidth = Math.max(1, (groupWidth * .72) / Math.max(1, chartSeries.length));
        chart = (
          <>
            {grid}
            {chartSeries.flatMap((item, seriesIndex) => item.points.map((point, pointIndex) => {
              const x = plot.left + pointIndex * groupWidth + (groupWidth - barWidth * chartSeries.length) / 2 + seriesIndex * barWidth;
              const y = yAt(point.y);
              return <rect key={`${seriesIndex}-${pointIndex}`} className={`${classPrefix}__bar`} x={x} y={Math.min(y, zeroY)} width={barWidth - 2} height={Math.max(1, Math.abs(zeroY - y))} fill={seriesColor(item, seriesIndex)} />;
            }))}
          </>
        );
        accessibleLabel = `Bar chart with ${count} categories and ${chartSeries.length} series`;
      } else {
        chart = (
          <>
            {grid}
            {chartSeries.map((item, seriesIndex) => {
              const color = seriesColor(item, seriesIndex);
              const points = item.points.map((point, pointIndex) => `${xAt(pointIndex, count)},${plot.top + (1 - (point.y - range.min) / (range.max - range.min)) * plotHeight}`);
              const firstX = count ? xAt(0, count) : plot.left;
              const lastX = count ? xAt(count - 1, count) : plot.left;
              const pointsString = points.join(' ');
              return (
                <g key={seriesIndex}>
                  {(type === 'area') && <polygon className={`${classPrefix}__area`} points={`${firstX},${zeroY} ${pointsString} ${lastX},${zeroY}`} fill={color} />}
                  <polyline className={`${classPrefix}__line`} points={pointsString} stroke={color} />
                  {type === 'line' && item.points.map((point, pointIndex) => (
                    <circle key={pointIndex} className={`${classPrefix}__point`} cx={xAt(pointIndex, count)} cy={yAt(point.y)} r="3" fill={color} />
                  ))}
                </g>
              );
            })}
          </>
        );
        accessibleLabel = `${type === 'sparkline' ? 'Sparkline' : `${type} chart`} with ${count} data points`;
      }
    } else if (type === 'scatter') {
      const points = chartSeries.flatMap((item, seriesIndex) => item.points.map((point, pointIndex) => ({
        point, seriesIndex, pointIndex, x: Number(point.x ?? pointIndex), color: seriesColor(item, seriesIndex),
      })));
      const xRange = numberRange(points.map((point) => point.x));
      const sx = (v: number) => plot.left + ((v - xRange.min) / (xRange.max - xRange.min)) * plotWidth;
      chart = (
        <>
          {grid}
          {points.map(({ point, seriesIndex, pointIndex, x, color }) => (
            <circle key={`${seriesIndex}-${pointIndex}`} className={`${classPrefix}__point`} cx={sx(x)} cy={yAt(point.y)} r="4" fill={color} />
          ))}
        </>
      );
      accessibleLabel = `Scatter chart with ${points.length} points`;
    } else if (type === 'donut') {
      const points = chartSeries.flatMap((item) => item.points);
      const total = points.reduce((sum, point) => sum + Math.max(0, point.y), 0);
      let angle = -Math.PI / 2;
      const cxValue = width / 2;
      const cyValue = height / 2;
      const radius = Math.max(1, Math.min(width, height) * .42);
      chart = (
        <>
          {points.map((point, index) => {
            const nextAngle = angle + (total ? Math.max(0, point.y) / total : 0) * Math.PI * 2;
            const isFullCircle = nextAngle - angle >= Math.PI * 2 - .001;
            const path = arcPath(cxValue, cyValue, radius, angle, nextAngle);
            angle = nextAngle;
            if (isFullCircle) {
              return <circle key={index} className={`${classPrefix}__slice`} cx={cxValue} cy={cyValue} r={radius} fill={colorAt(index)} />;
            }
            return <path key={index} className={`${classPrefix}__slice`} d={path} fill={colorAt(index)} />;
          })}
          <circle cx={cxValue} cy={cyValue} r={radius * .56} className={`${classPrefix}__donut-hole`} />
        </>
      );
      accessibleLabel = `Donut chart with ${points.length} segments`;
    } else if (type === 'gauge') {
      const current = value ?? chartSeries[0]?.points[0]?.y ?? 0;
      const low = min ?? 0;
      const high = max ?? 100;
      const fraction = Math.max(0, Math.min(1, (current - low) / (high - low || 1)));
      const cxValue = width / 2;
      const cyValue = height * .78;
      const radius = Math.max(0, Math.min(width / 2 - 8, cyValue - 8, height * .68));
      const start = Math.PI;
      const end = start + fraction * Math.PI;
      chart = (
        <>
          <path className={`${classPrefix}__gauge-track`} d={curvePath(cxValue, cyValue, radius, start, 2 * Math.PI)} />
          <path className={`${classPrefix}__gauge-value`} d={curvePath(cxValue, cyValue, radius, start, end)} />
          <text className={`${classPrefix}__gauge-label`} x={cxValue} y={cyValue - 8} textAnchor="middle">{current}</text>
        </>
      );
      accessibleLabel = `Gauge chart: ${current}, range ${low} to ${high}`;
    } else if (type === 'radar') {
      const count = Math.max(0, ...chartSeries.map((item) => item.points.length));
      const cxValue = width / 2;
      const cyValue = height / 2;
      const radius = Math.min(width, height) * .38;
      const maxValue = max ?? Math.max(1, ...allValues);
      chart = (
        <>
          {[.25, .5, .75, 1].map((fraction) => {
            const pts = Array.from({ length: count }, (_, i) => {
              const angle = -Math.PI / 2 + (i * Math.PI * 2) / Math.max(1, count);
              return `${cxValue + Math.cos(angle) * radius * fraction},${cyValue + Math.sin(angle) * radius * fraction}`;
            }).join(' ');
            return <polygon key={fraction} className={`${classPrefix}__radar-grid`} points={pts} />;
          })}
          {chartSeries.map((item, seriesIndex) => {
            const pts = item.points.map((point, i) => {
              const angle = -Math.PI / 2 + (i * Math.PI * 2) / Math.max(1, count);
              const r = radius * Math.max(0, Math.min(1, point.y / maxValue));
              return `${cxValue + Math.cos(angle) * r},${cyValue + Math.sin(angle) * r}`;
            }).join(' ');
            return <polygon key={seriesIndex} className={`${classPrefix}__radar-area`} points={pts} stroke={seriesColor(item, seriesIndex)} fill={seriesColor(item, seriesIndex)} />;
          })}
        </>
      );
      accessibleLabel = `Radar chart with ${chartSeries.length} series and ${count} axes`;
    } else if (type === 'heatmap') {
      const matrix = Array.isArray(data[0])
        ? data as number[][]
        : chartSeries.map((item) => item.points.map((point) => point.y));
      const flat = matrix.flat();
      const heatRange = numberRange(flat, min, max);
      const cellGap = 2;
      const cellWidth = (width - cellGap * Math.max(0, (matrix[0]?.length ?? 0) - 1)) / Math.max(1, matrix[0]?.length ?? 0);
      const cellHeight = (height - cellGap * Math.max(0, matrix.length - 1)) / Math.max(1, matrix.length);
      chart = matrix.flatMap((row, rowIndex) => row.map((cell, columnIndex) => {
        const ratio = Math.max(0, Math.min(1, (cell - heatRange.min) / (heatRange.max - heatRange.min)));
        return (
          <rect
            key={`${rowIndex}-${columnIndex}`}
            className={`${classPrefix}__heat-cell`}
            x={columnIndex * (cellWidth + cellGap)}
            y={rowIndex * (cellHeight + cellGap)}
            width={cellWidth}
            height={cellHeight}
            fill="var(--rd-chart-1)"
            fillOpacity={.15 + ratio * .85}
          />
        );
      }));
      accessibleLabel = `Heatmap with ${matrix.length} rows and ${matrix[0]?.length ?? 0} columns`;
    } else if (type === 'funnel' || type === 'pyramid') {
      const points = chartSeries.flatMap((item) => item.points);
      const values = points.map((point) => Math.max(0, point.y));
      const largest = Math.max(1, ...values);
      const segmentHeight = height / Math.max(1, points.length);
      const cxValue = width / 2;
      chart = points.map((point, index) => {
        const upper = (values[index] / largest) * width * .46;
        const lowerValue = type === 'pyramid' ? values[index] : (values[index + 1] ?? 0);
        const lower = (lowerValue / largest) * width * .46;
        const y = index * segmentHeight;
        const pointsAttr = `${cxValue - upper},${y} ${cxValue + upper},${y} ${cxValue + lower},${y + segmentHeight} ${cxValue - lower},${y + segmentHeight}`;
        return <polygon key={index} className={`${classPrefix}__funnel-segment`} points={pointsAttr} fill={colorAt(index)} />;
      });
      accessibleLabel = `${type} chart with ${points.length} stages`;
    } else if (type === 'rangeBar') {
      const points = chartSeries.flatMap((item) => item.points);
      const low = Math.min(0, ...points.map((point) => point.low ?? 0));
      const high = Math.max(1, ...points.map((point) => point.high ?? point.y));
      const scale = (v: number) => plot.left + ((v - low) / (high - low || 1)) * plotWidth;
      const band = plotHeight / Math.max(1, points.length);
      chart = points.map((point, index) => {
        const x1 = scale(point.low ?? 0);
        const x2 = scale(point.high ?? point.y);
        return <rect key={index} className={`${classPrefix}__bar`} x={x1} y={plot.top + index * band + band * .2} width={Math.max(1, x2 - x1)} height={band * .6} fill={colorAt(index)} />;
      });
      accessibleLabel = `Range bar chart with ${points.length} intervals`;
    } else {
      const points = chartSeries.flatMap((item) => item.points);
      const candleRange = numberRange(points.flatMap((point) => [point.low ?? point.y, point.high ?? point.y, point.open ?? point.y, point.close ?? point.y]), min, max);
      const scale = (v: number) => plot.bottom - ((v - candleRange.min) / (candleRange.max - candleRange.min)) * plotHeight;
      const band = plotWidth / Math.max(1, points.length);
      chart = (
        <>
          {grid}
          {points.map((point, index) => {
            const open = point.open ?? point.y;
            const close = point.close ?? point.y;
            const x = plot.left + index * band + band / 2;
            const top = Math.min(scale(open), scale(close));
            const bodyHeight = Math.max(2, Math.abs(scale(open) - scale(close)));
            const color = close >= open ? 'var(--rd-chart-up)' : 'var(--rd-chart-down)';
            return (
              <g key={index} className={`${classPrefix}__candle`} stroke={color} fill={color}>
                <line x1={x} x2={x} y1={scale(point.high ?? Math.max(open, close))} y2={scale(point.low ?? Math.min(open, close))} />
                <rect x={x - band * .24} y={top} width={band * .48} height={bodyHeight} />
              </g>
            );
          })}
        </>
      );
      accessibleLabel = `Candlestick chart with ${points.length} data points`;
    }

    return (
      <div
        {...rootProps}
        ref={ref}
        className={cx(rootClassName, className)}
        data-rd-theme={theme}
      >
        <svg {...common} aria-label={rootProps['aria-label'] ?? accessibleLabel}>
          {chart}
        </svg>
      </div>
    );
  },
);

export const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  function Chart(props, ref) {
    const { theme, ...chartProps } = props;
    return (
      <ChartCore
        {...chartProps}
        ref={ref}
        theme={theme}
        classPrefix="rd-chart"
        rootClassName="rd-chart"
      />
    );
  },
);

Chart.displayName = 'Chart';
