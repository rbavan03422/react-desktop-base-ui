import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';

export interface LabelProps extends LayoutProps, Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color' | 'hidden'> {
  color?: string; size?: number | string;
}

export function Label({ color, size, className, style, ...p }: LabelProps) {
  const [ls, rest] = splitLayout(p);
  return <label className={cx('rd-mac rd-mac-label', className)} style={{ color, fontSize: size, ...ls, ...style }} {...rest} />;
}
