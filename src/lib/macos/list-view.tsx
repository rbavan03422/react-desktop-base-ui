import * as React from 'react';
import { cx, splitLayout, type LayoutProps } from '../common';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'hidden'>;
interface Common extends LayoutProps, DivProps { background?: string }

function make(name: string, base: string, extra?: Partial<React.HTMLAttributes<HTMLDivElement>>) {
  const C = React.forwardRef<HTMLDivElement, Common>(({ background, className, style, ...p }, ref) => {
    const [ls, rest] = splitLayout(p);
    return <div ref={ref} className={cx('rd-mac', base, className)} style={{ background, ...ls, ...style }} {...extra} {...rest} />;
  });
  C.displayName = name;
  return C;
}

export const ListViewHeader = make('ListViewHeader', 'rd-mac-lv__header');
export const ListViewFooter = make('ListViewFooter', 'rd-mac-lv__footer');
export const ListViewSeparator = make('ListViewSeparator', 'rd-mac-lv__separator', { role: 'separator' });

export interface ListViewSectionProps extends Common { header?: React.ReactNode }
export function ListViewSection({ header, children, className, ...rest }: ListViewSectionProps) {
  return (
    <div role="group" className={cx('rd-mac rd-mac-lv__section', className)} {...rest}>
      {header != null && <div className="rd-mac-lv__sectionheader">{header}</div>}
      {children}
    </div>
  );
}

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
