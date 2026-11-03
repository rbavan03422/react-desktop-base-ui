import * as React from 'react';
import { cx } from '../../common';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'color' | 'hidden'>;

/** Anchors its children to an edge of the nearest positioned ancestor. */
export interface PinProps extends DivProps {
  top?: number | string; right?: number | string; bottom?: number | string; left?: number | string;
}

export function Pin({ top, right, bottom, left, className, style, ...rest }: PinProps) {
  return <div className={cx('rd-mac rd-mac-pin', className)} style={{ top, right, bottom, left, ...style }} {...rest} />;
}
