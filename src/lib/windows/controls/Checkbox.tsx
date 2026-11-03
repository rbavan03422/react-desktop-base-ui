import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, 'className' | 'children'>, Themed {
  label?: React.ReactNode;
  className?: string;
}

export function Checkbox({ label, theme, color, className, style, ...rest }: CheckboxProps) {
  return (
    <label className={cx('rd-win rd-win-choice', className)} {...themed(theme, color)}>
      <BaseCheckbox.Root className="rd-win-checkbox" {...rest}>
        <BaseCheckbox.Indicator className="rd-win-checkbox__mark">
          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden>
            <path d="M2 6.2l2.6 2.6L10 3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label != null && <span className="rd-win-choice__label">{label}</span>}
    </label>
  );
}
