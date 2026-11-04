import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type SwitchProps = Omit<React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>, 'className' | 'children'> & {
  label?: React.ReactNode;
  className?: string;
} & Themed;

export function Switch({ theme, color, label, className, ...rest }: SwitchProps) {
  return (
    <label className={cx('rd-win rd-win-choice', className)} {...themed(theme, color)}>
      <BaseSwitch.Root className="rd-win-switch" {...rest}>
        <BaseSwitch.Thumb className="rd-win-switch__thumb" />
      </BaseSwitch.Root>
      {label != null && <span className="rd-win-choice__label">{label}</span>}
    </label>
  );
}
