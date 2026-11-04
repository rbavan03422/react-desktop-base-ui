import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cx } from '../../common';

export type ToolbarSeparatorProps = Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Separator>, 'className'> & {
  className?: string;
};

/** Must be inside <Toolbar>. */
export function ToolbarSeparator({ className, ...rest }: ToolbarSeparatorProps) {
  return <BaseToolbar.Separator className={cx('rd-mac-toolbar__separator', className)} {...rest} />;
}
