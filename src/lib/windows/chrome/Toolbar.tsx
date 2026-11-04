import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cx, splitLayout, type LayoutProps } from '../../common';
import { themed, type Themed } from '../shared';

export type ToolbarProps = LayoutProps & Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Root>, 'className' | 'hidden'> & {
  className?: string;
} & Themed;

/** Windows command bar. */
export function Toolbar({ theme, color, className, style, ...p }: ToolbarProps) {
  const [ls, rest] = splitLayout(p);
  return (
    <BaseToolbar.Root
      className={cx('rd-win rd-win-toolbar', className)}
      {...themed(theme, color, { ...ls, ...(style as React.CSSProperties) })}
      {...rest}
    />
  );
}
