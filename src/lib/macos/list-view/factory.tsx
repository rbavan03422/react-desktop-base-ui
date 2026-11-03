import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../../common';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'hidden'>;

export interface Common extends LayoutProps, DivProps { background?: string }

export function make(name: string, base: string, extra?: Partial<React.HTMLAttributes<HTMLDivElement>>) {
  const C = React.forwardRef<HTMLDivElement, Common>(({ background, className, style, ...p }, ref) => {
    const [ls, rest] = splitLayout(p);
    return <div ref={ref} className={cx('rd-mac', base, className)} style={{ background, ...ls, ...style }} {...extra} {...rest} />;
  });
  C.displayName = name;
  return C;
}
