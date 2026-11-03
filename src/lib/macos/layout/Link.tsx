import * as React from 'react';
import { cx } from '../../common';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> { color?: string }

export function Link({ color, className, style, ...rest }: LinkProps) {
  return <a className={cx('rd-mac rd-mac-link', className)} style={{ color, ...style }} {...rest} />;
}
