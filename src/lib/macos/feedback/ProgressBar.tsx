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
export function ProgressBar({ theme, label, showValue, className, ...rest }: ProgressBarProps) {
  return (
    <BaseProgress.Root className={cx('rd-mac rd-mac-pbar', className)} {...themed(theme)} {...rest}>
      {(label != null || showValue) && (
        <div className="rd-mac-pbar__header">
          {label != null && <BaseProgress.Label className="rd-mac-pbar__label">{label}</BaseProgress.Label>}
          {showValue && <BaseProgress.Value className="rd-mac-pbar__value" />}
        </div>
      )}
      <BaseProgress.Track className="rd-mac-pbar__track">
        <BaseProgress.Indicator className="rd-mac-pbar__indicator" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
