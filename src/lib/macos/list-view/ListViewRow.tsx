import * as React from 'react';
import { cx, splitLayout } from '../../common';
import type { Common } from './factory';

export interface ListViewRowProps extends Common { selected?: boolean }

export const ListViewRow = React.forwardRef<HTMLDivElement, ListViewRowProps>(
  ({ selected, background, className, style, ...p }, ref) => {
    const [ls, rest] = splitLayout(p);
    return (
      <div
        ref={ref}
        role="option"
        tabIndex={selected ? 0 : -1}
        aria-selected={!!selected}
        className={cx('rd-mac rd-mac-lv__row', className)}
        style={{ background, ...ls, ...style }}
        {...rest}
      />
    );
  }
);
ListViewRow.displayName = 'ListViewRow';
