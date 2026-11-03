import * as React from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { cx } from '../../common';

export interface RadioProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'className' | 'children'> {
  label?: React.ReactNode;
  className?: string;
}

export function Radio({ label, className, ...rest }: RadioProps) {
  return (
    <label className={cx('rd-mac rd-mac-choice', className)}>
      <BaseRadio.Root className="rd-mac-radio" {...rest}>
        <BaseRadio.Indicator className="rd-mac-radio__dot" />
      </BaseRadio.Root>
      {label != null && <span className="rd-mac-choice__label">{label}</span>}
    </label>
  );
}
