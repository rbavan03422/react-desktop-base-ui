import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'hidden'>;

export interface ViewProps extends LayoutProps, DivProps {
  background?: string;
}

export const View = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ background, className, style, ...p }, ref) => {
    const [ls, rest] = splitLayout(p);
    return <div ref={ref} className={cx('rd-mac rd-mac-view', className)} style={{ background, ...ls, ...style }} {...rest} />;
  }
);
View.displayName = 'View';
