import * as React from 'react';
import { Progress } from '@base-ui/react/progress';

/** Percentage bar with a centred label, shown in a grid cell. */
export function PercentCell({ value, max = 100, decimals = 0, label }: {
  value: unknown;
  max?: number;
  decimals?: number;
  label: string;
}) {
  const n = Number(value);
  const has = value != null && value !== '' && Number.isFinite(n);
  const pct = has ? Math.max(0, Math.min(100, (n / max) * 100)) : 0;
  return (
    <Progress.Root value={pct} aria-label={label} className="rd-win-grid__percent">
      <Progress.Track className="rd-win-grid__percenttrack">
        <Progress.Indicator className="rd-win-grid__percentbar" style={{ width: `${pct}%`, height: '100%' }} />
      </Progress.Track>
      <span className="rd-win-grid__percentlabel">{has ? `${pct.toFixed(decimals)}%` : ''}</span>
    </Progress.Root>
  );
}
