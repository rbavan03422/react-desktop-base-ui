import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';
import type { Themed } from '../shared';

export interface TextProps extends LayoutProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color' | 'hidden'>, Themed {
  size?: number | string; bold?: boolean;
}

export function Text({ theme, color, size, bold, className, style, ...p }: TextProps) {
  const [ls, rest] = splitLayout(p);
  return (
    <span
      className={cx('rd-win rd-win-text', className)}
      data-rd-theme={theme}
      style={{ color, fontSize: size, fontWeight: bold ? 600 : undefined, ...ls, ...style }}
      {...rest}
    />
  );
}
