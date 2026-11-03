import * as React from 'react';
import { cx } from '../../common';
import type { Common } from './factory';

export interface ListViewSectionProps extends Common { header?: React.ReactNode }

export function ListViewSection({ header, children, className, ...rest }: ListViewSectionProps) {
  return (
    <div role="group" className={cx('rd-mac rd-mac-lv__section', className)} {...rest}>
      {header != null && <div className="rd-mac-lv__sectionheader">{header}</div>}
      {children}
    </div>
  );
}
