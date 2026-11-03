import { Progress } from '@base-ui/react/progress';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export interface ProgressCircleProps extends Themed {
  size?: number;
  /** 0-100 for determinate; omit for the indeterminate ring. */
  value?: number | null;
  className?: string;
}

export function ProgressCircle({ size = 40, value, theme, color, className }: ProgressCircleProps) {
  const det = typeof value === 'number';
  const r = 16, c = 2 * Math.PI * r;
  return (
    <Progress.Root
      value={det ? value! : null}
      className={cx('rd-win rd-win-progress', className)}
      {...themed(theme, color, { width: size, height: size })}
    >
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden className={det ? undefined : 'rd-win-progress__spin'}>
        <circle cx="20" cy="20" r={r} fill="none" strokeWidth="4" className="rd-win-progress__track" />
        <circle
          cx="20" cy="20" r={r} fill="none" strokeWidth="4" strokeLinecap="butt" className="rd-win-progress__bar"
          strokeDasharray={det ? c : `${c * 0.28} ${c}`}
          strokeDashoffset={det ? c * (1 - value! / 100) : 0}
          transform="rotate(-90 20 20)"
        />
      </svg>
    </Progress.Root>
  );
}
