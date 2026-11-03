import * as React from 'react';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export interface RadioGroupProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseRadioGroup>, 'className'>, Themed {
  className?: string;
}

export function RadioGroup({ theme, color, className, style, ...rest }: RadioGroupProps) {
  return <BaseRadioGroup className={cx('rd-win rd-win-radiogroup', className)} {...themed(theme, color)} {...rest} />;
}
