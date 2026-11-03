import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';
import { themed, type Themed } from '../shared';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'hidden'>;

export interface WindowProps extends LayoutProps, DivProps, Themed {
  chrome?: boolean;
  background?: boolean | string;
}

export const Window = React.forwardRef<HTMLDivElement, WindowProps>(
  ({ theme = 'light', color, chrome, background, className, style, ...p }, ref) => {
    const [ls, rest] = splitLayout(p);
    const t = themed(theme, color, {
      ...(typeof background === 'string' ? { background } : null),
      ...ls, ...style,
    });
    return (
      <div
        ref={ref}
        className={cx('rd-win rd-win-window', chrome && 'rd-win-window--chrome', background && 'rd-win-window--bg', className)}
        {...t}
        {...rest}
      />
    );
  }
);
Window.displayName = 'Window';
