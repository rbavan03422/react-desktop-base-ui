import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { cx } from '../../common';


export type SwitchProps = Omit<React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>, 'className' | 'children'> & {
  label?: React.ReactNode;
  className?: string;
};

export function Switch({ label, className, ...rest }: SwitchProps) {
  return (
    <label className={cx('rd-mac rd-mac-choice', className)} >
      <BaseSwitch.Root className="rd-mac-switch" {...rest}>
        <BaseSwitch.Thumb className="rd-mac-switch__thumb" />
      </BaseSwitch.Root>
      {label != null && <span className="rd-mac-choice__label">{label}</span>}
    </label>
  );
}
