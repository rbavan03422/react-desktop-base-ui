import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type SwitchProps = Omit<React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>, 'className' | 'children'> & {
  label?: React.ReactNode;
  className?: string;
} & Themed;

export function Switch({ theme, label, className, ...rest }: SwitchProps) {
  return (
    <label className={cx('rd-mac rd-mac-choice', className)} {...themed(theme)}>
      <BaseSwitch.Root className="rd-mac-switch" {...rest}>
        <BaseSwitch.Thumb className="rd-mac-switch__thumb" />
      </BaseSwitch.Root>
      {label != null && <span className="rd-mac-choice__label">{label}</span>}
    </label>
  );
}
