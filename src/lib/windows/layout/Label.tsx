import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';
import type { Themed } from '../shared';

export interface LabelProps extends LayoutProps, Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color' | 'hidden'>, Themed {}

export function Label({ theme, color, className, style, ...p }: LabelProps) {
  const [ls, rest] = splitLayout(p);
  return <label className={cx('rd-win rd-win-label', className)} data-rd-theme={theme} style={{ color, ...ls, ...style }} {...rest} />;
}
