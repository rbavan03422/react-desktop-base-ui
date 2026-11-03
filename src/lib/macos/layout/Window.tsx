import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'hidden'>;

export interface WindowProps extends LayoutProps, DivProps {
  chrome?: boolean;
  background?: string;
}

export const Window = React.forwardRef<HTMLDivElement, WindowProps>(
  ({ chrome, background, className, style, ...p }, ref) => {
    const [ls, rest] = splitLayout(p);
    return (
      <div
        ref={ref}
        tabIndex={-1}
        className={cx('rd-mac rd-mac-window', chrome && 'rd-mac-window--chrome', className)}
        style={{ background, ...ls, ...style }}
        {...rest}
      />
    );
  }
);
Window.displayName = 'Window';
