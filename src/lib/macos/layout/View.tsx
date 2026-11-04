import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';
import { type Themed } from '../shared';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'hidden'>;

export interface ViewProps extends LayoutProps, DivProps, Themed {
  background?: string;
}

export const View = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ theme, background, className, style, ...p }, ref) => {
    const [ls, rest] = splitLayout(p);
    return <div ref={ref} className={cx('rd-mac rd-mac-view', className)} style={{ background, ...ls, ...style }} data-rd-theme={theme} {...rest} />;
  }
);
View.displayName = 'View';
