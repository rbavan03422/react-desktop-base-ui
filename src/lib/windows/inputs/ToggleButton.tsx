import * as React from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type ToggleButtonProps = Omit<React.ComponentPropsWithoutRef<typeof BaseToggle>, 'className'> & {
  className?: string;
} & Themed;

export function ToggleButton({ theme, color, className, ...rest }: ToggleButtonProps) {
  return <BaseToggle className={cx('rd-win rd-win-togglebutton', className)} {...themed(theme, color)} {...rest} />;
}
