import * as React from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export interface RadioProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'className' | 'children'>, Themed {
  label?: React.ReactNode;
  className?: string;
}

export function Radio({ label, theme, color, className, ...rest }: RadioProps) {
  return (
    <label className={cx('rd-win rd-win-choice', className)} {...themed(theme, color)}>
      <BaseRadio.Root className="rd-win-radio" {...rest}>
        <BaseRadio.Indicator className="rd-win-radio__dot" />
      </BaseRadio.Root>
      {label != null && <span className="rd-win-choice__label">{label}</span>}
    </label>
  );
}
