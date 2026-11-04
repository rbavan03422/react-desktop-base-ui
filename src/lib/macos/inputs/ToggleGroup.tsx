import * as React from 'react';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { cx } from '../../common';


export type ToggleGroupProps = Omit<React.ComponentPropsWithoutRef<typeof BaseToggleGroup>, 'className'> & {
  className?: string;
};

export function ToggleGroup({ className, ...rest }: ToggleGroupProps) {
  return <BaseToggleGroup className={cx('rd-mac rd-mac-togglegroup', className)}  {...rest} />;
}
