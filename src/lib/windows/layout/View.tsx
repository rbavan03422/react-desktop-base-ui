import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';
import { themed, type Themed } from '../shared';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'hidden'>;

export interface ViewProps extends LayoutProps, DivProps, Themed {
  background?: boolean | string;
  chrome?: boolean;
}

export const View = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ theme, color, background, chrome, className, style, ...p }, ref) => {
    const [ls, rest] = splitLayout(p);
    const t = themed(theme, color, { ...(typeof background === 'string' ? { background } : null), ...ls, ...style });
    return (
      <div
        ref={ref}
        className={cx('rd-win rd-win-view', background && 'rd-win-view--bg', chrome && 'rd-win-view--chrome', className)}
        {...t}
        {...rest}
      />
    );
  }
);
View.displayName = 'View';
