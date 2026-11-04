import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cx } from '../../common';

export type ToolbarButtonProps = Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Button>, 'className'> & {
  className?: string;
};

/** Must be inside <Toolbar>. Add aria-pressed / data attributes yourself for toggle behaviour. */
export function ToolbarButton({ className, ...rest }: ToolbarButtonProps) {
  return <BaseToolbar.Button className={cx('rd-mac-toolbar__button', className)} {...rest} />;
}
