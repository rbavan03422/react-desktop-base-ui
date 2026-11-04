import * as React from 'react';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type ToggleGroupProps = Omit<React.ComponentPropsWithoutRef<typeof BaseToggleGroup>, 'className'> & {
  className?: string;
} & Themed;

export function ToggleGroup({ theme, className, ...rest }: ToggleGroupProps) {
  return <BaseToggleGroup className={cx('rd-mac rd-mac-togglegroup', className)} {...themed(theme)} {...rest} />;
}
