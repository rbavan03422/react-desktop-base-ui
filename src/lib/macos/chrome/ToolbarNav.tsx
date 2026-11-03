import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cx } from '../../common';

/** Must be rendered inside <Toolbar>. */
export function ToolbarNav({ className, ...rest }: Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Group>, 'className'> & { className?: string }) {
  return <BaseToolbar.Group className={cx('rd-mac-toolbarnav', className)} {...rest} />;
}
