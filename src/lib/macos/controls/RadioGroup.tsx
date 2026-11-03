import * as React from 'react';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { cx } from '../../common';

export interface RadioGroupProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseRadioGroup>, 'className'> {
  className?: string;
}

export function RadioGroup({ className, ...rest }: RadioGroupProps) {
  return <BaseRadioGroup className={cx('rd-mac rd-mac-radiogroup', className)} {...rest} />;
}
