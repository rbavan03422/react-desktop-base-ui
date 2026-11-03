import { Progress } from '@base-ui/react/progress';
import { cx } from '../../common';

export interface ProgressCircleProps {
  size?: number;
  /** 0-100 for determinate; omit for the indeterminate spinner. */
  value?: number | null;
  className?: string;
}

export function ProgressCircle({ size = 25, value, className }: ProgressCircleProps) {
  const det = typeof value === 'number';
  return (
    <Progress.Root value={det ? value! : null} className={cx('rd-mac rd-mac-progress', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i} x1="12" y1="2.5" x2="12" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${i * 30} 12 12)`}
            className={det ? undefined : 'rd-mac-progress__tick'}
            style={det ? { opacity: i < (value! / 100) * 12 ? 1 : 0.2 } : { animationDelay: `${i / 12 - 1}s` }}
          />
        ))}
      </svg>
    </Progress.Root>
  );
}
