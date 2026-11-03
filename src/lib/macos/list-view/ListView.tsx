import * as React from 'react';
import { cx, splitLayout } from '../../common';
import type { Common } from './factory';

export const ListView = React.forwardRef<HTMLDivElement, Common>(({ background, className, style, onKeyDown, ...p }, ref) => {
  const [ls, rest] = splitLayout(p);
  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const rows = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="option"]'));
    const i = rows.indexOf(document.activeElement as HTMLElement);
    const next = rows[e.key === 'ArrowDown' ? Math.min(i + 1, rows.length - 1) : Math.max(i - 1, 0)];
    if (next) { e.preventDefault(); next.focus(); }
  };
  return (
    <div
      ref={ref}
      role="listbox"
      className={cx('rd-mac rd-mac-lv', className)}
      style={{ background, ...ls, ...style }}
      onKeyDown={handleKey}
      {...rest}
    />
  );
});
ListView.displayName = 'ListView';
