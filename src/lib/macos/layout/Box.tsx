import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';

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
