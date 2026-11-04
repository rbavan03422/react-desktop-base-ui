import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type ProgressBarProps = Omit<React.ComponentPropsWithoutRef<typeof BaseProgress.Root>, 'className' | 'children'> & {
  label?: React.ReactNode;
  showValue?: boolean;
  className?: string;
} & Themed;

/** Linear progress. Pass `value={null}` for the indeterminate animation. */
export function ProgressBar({ theme, color, label, showValue, className, ...rest }: ProgressBarProps) {
  return (
    <BaseProgress.Root className={cx('rd-win rd-win-pbar', className)} {...themed(theme, color)} {...rest}>
      {(label != null || showValue) && (
        <div className="rd-win-pbar__header">
          {label != null && <BaseProgress.Label className="rd-win-pbar__label">{label}</BaseProgress.Label>}
          {showValue && <BaseProgress.Value className="rd-win-pbar__value" />}
        </div>
      )}
      <BaseProgress.Track className="rd-win-pbar__track">
        <BaseProgress.Indicator className="rd-win-pbar__indicator" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
