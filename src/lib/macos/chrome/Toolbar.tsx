import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cx, splitLayout, type LayoutProps } from '../../common';

export interface ToolbarProps extends LayoutProps, Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Root>, 'className' | 'hidden'> {
  className?: string;
}

export function Toolbar({ className, style, ...p }: ToolbarProps) {
  const [ls, rest] = splitLayout(p);
  return <BaseToolbar.Root className={cx('rd-mac rd-mac-toolbar', className)} style={{ ...ls, ...(style as React.CSSProperties) }} {...rest} />;
}
