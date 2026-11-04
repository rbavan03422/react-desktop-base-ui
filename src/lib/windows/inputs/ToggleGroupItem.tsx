import * as React from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { cx } from '../../common';

export type ToggleGroupItemProps = Omit<React.ComponentPropsWithoutRef<typeof BaseToggle>, 'className'> & {
  className?: string;
};

/** Must be inside <ToggleGroup>; give it a `value`. */
export function ToggleGroupItem({ className, ...rest }: ToggleGroupItemProps) {
  return <BaseToggle className={cx('rd-win-togglegroup__item', className)} {...rest} />;
}
