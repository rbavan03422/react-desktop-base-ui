import * as React from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cx } from '../../common';


export type ToggleButtonProps = Omit<React.ComponentPropsWithoutRef<typeof BaseToggle>, 'className'> & {
  className?: string;
};

export function ToggleButton({ className, ...rest }: ToggleButtonProps) {
  return <BaseToggle className={cx('rd-mac rd-mac-togglebutton', className)}  {...rest} />;
}
