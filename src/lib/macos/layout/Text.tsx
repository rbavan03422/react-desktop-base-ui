import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';

export interface TextProps extends LayoutProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color' | 'hidden'> {
  color?: string; size?: number | string; bold?: boolean; align?: 'left' | 'center' | 'right';
}

export function Text({ color, size, bold, align, className, style, ...p }: TextProps) {
  const [ls, rest] = splitLayout(p);
  return (
    <span
      className={cx('rd-mac rd-mac-text', className)}
      style={{ color, fontSize: size, fontWeight: bold ? 600 : undefined, textAlign: align, ...ls, ...style }}
      {...rest}
    />
  );
}
