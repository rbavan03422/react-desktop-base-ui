import * as React from 'react';
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type MeterProps = Omit<React.ComponentPropsWithoutRef<typeof BaseMeter.Root>, 'className' | 'children'> & {
  label?: React.ReactNode;
  showValue?: boolean;
  /** Values at or above these turn the bar yellow / red (like NSLevelIndicator). */
  warning?: number;
  critical?: number;
  className?: string;
} & Themed;

/** macOS level indicator. */
export function Meter({ theme, label, showValue, warning, critical, className, ...rest }: MeterProps) {
  const level = critical !== undefined && rest.value >= critical ? 'critical'
    : warning !== undefined && rest.value >= warning ? 'warning' : 'ok';
  return (
    <BaseMeter.Root className={cx('rd-mac rd-mac-meter', className)} data-level={level} {...themed(theme)} {...rest}>
      {(label != null || showValue) && (
        <div className="rd-mac-meter__header">
          {label != null && <BaseMeter.Label className="rd-mac-meter__label">{label}</BaseMeter.Label>}
          {showValue && <BaseMeter.Value className="rd-mac-meter__value" />}
        </div>
      )}
      <BaseMeter.Track className="rd-mac-meter__track">
        <BaseMeter.Indicator className="rd-mac-meter__indicator" />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
