import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../common';
import { themed, type Theme } from './shared';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'hidden'>;
interface Themed { theme?: Theme; color?: string }

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

export interface LabelProps extends LayoutProps, Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color' | 'hidden'>, Themed {}
export function Label({ theme, color, className, style, ...p }: LabelProps) {
  const [ls, rest] = splitLayout(p);
  return <label className={cx('rd-win rd-win-label', className)} data-rd-theme={theme} style={{ color, ...ls, ...style }} {...rest} />;
}
