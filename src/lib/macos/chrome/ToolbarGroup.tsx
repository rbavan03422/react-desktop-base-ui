import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cx } from '../../common';

export type ToolbarGroupProps = Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Group>, 'className'> & {
  className?: string;
};

/** Must be inside <Toolbar>. */
export function ToolbarGroup({ className, ...rest }: ToolbarGroupProps) {
  return <BaseToolbar.Group className={cx('rd-mac-toolbar__group', className)} {...rest} />;
}
