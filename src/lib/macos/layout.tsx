import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../common';

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

export interface BoxProps extends LayoutProps, Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'hidden'> {
  label?: React.ReactNode;
}
export function Box({ label, className, style, children, ...p }: BoxProps) {
  const [ls, rest] = splitLayout(p);
  return (
    <fieldset className={cx('rd-mac rd-mac-box', className)} style={{ ...ls, ...style }} {...rest}>
      {label != null && <legend className="rd-mac-box__label">{label}</legend>}
      {children}
    </fieldset>
  );
}

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

export interface LabelProps extends LayoutProps, Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color' | 'hidden'> {
  color?: string; size?: number | string;
}
export function Label({ color, size, className, style, ...p }: LabelProps) {
  const [ls, rest] = splitLayout(p);
  return <label className={cx('rd-mac rd-mac-label', className)} style={{ color, fontSize: size, ...ls, ...style }} {...rest} />;
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> { color?: string }
export function Link({ color, className, style, ...rest }: LinkProps) {
  return <a className={cx('rd-mac rd-mac-link', className)} style={{ color, ...style }} {...rest} />;
}

/** Anchors its children to an edge of the nearest positioned ancestor. */
export interface PinProps extends DivProps {
  top?: number | string; right?: number | string; bottom?: number | string; left?: number | string;
}
export function Pin({ top, right, bottom, left, className, style, ...rest }: PinProps) {
  return <div className={cx('rd-mac rd-mac-pin', className)} style={{ top, right, bottom, left, ...style }} {...rest} />;
}
