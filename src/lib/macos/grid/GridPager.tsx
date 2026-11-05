import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';
import type { Themed } from '../shared';
import { Select } from '../inputs';

const icon = (d: string) => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const FIRST = icon('M4 3v10M12 3L7 8l5 5');
const PREV = icon('M10 3L5 8l5 5');
const NEXT = icon('M6 3l5 5-5 5');
const LAST = icon('M12 3v10M4 3l5 5-5 5');

export type GridPagerProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  pageSizeOptions?: number[];
  total: number;
  pagination?: boolean;
  subtotals?: { field: string; label: string; value: number }[];
  onPage: (page: number) => void;
  onPageSize?: (size: number) => void;
} & Themed;

/** Paging toolbar like Ext.toolbar.Paging: first / prev / "Page [n] of N" / next / last, rows per page, range text. */
export function GridPager({ theme, page, pageCount, pageSize, pageSizeOptions, total, pagination = true, subtotals = [], onPage, onPageSize }: GridPagerProps) {
  const [text, setText] = React.useState(String(page));
  React.useEffect(() => { setText(String(page)); }, [page]);
  const commit = () => {
    const n = Math.round(Number(text));
    if (Number.isFinite(n) && n >= 1) onPage(Math.min(pageCount, n));
    else setText(String(page));
  };
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);
  return (
    <div className="rd-mac-grid__footer" role={pagination ? 'navigation' : 'status'} aria-label={pagination ? 'Pagination' : 'Selection subtotal'}>
      {pagination && <div className="rd-mac-grid__pager">
        <BaseButton className="rd-mac-grid__pagebtn" aria-label="First page" disabled={page <= 1} onClick={() => onPage(1)}>{FIRST}</BaseButton>
        <BaseButton className="rd-mac-grid__pagebtn" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)}>{PREV}</BaseButton>
        <span>Page</span>
        <Input
          className="rd-mac-grid__pageinput" type="number" min={1} max={pageCount} value={text} aria-label="Page number"
          onChange={(e) => setText(e.target.value)} onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
        />
        <span>of {pageCount}</span>
        <BaseButton className="rd-mac-grid__pagebtn" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>{NEXT}</BaseButton>
        <BaseButton className="rd-mac-grid__pagebtn" aria-label="Last page" disabled={page >= pageCount} onClick={() => onPage(pageCount)}>{LAST}</BaseButton>
      </div>}
      {pagination && pageSizeOptions && onPageSize && (
        <div className="rd-mac-grid__pagesize">
          <span>Rows</span>
          <Select theme={theme}
            className="rd-mac-grid__pagesel" aria-label="Rows per page" value={String(pageSize)}
            items={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
            onValueChange={(v) => onPageSize(Number(v))}
          />
        </div>
      )}
      {subtotals.length > 0 && (
        <span className="rd-mac-grid__subtotal" aria-live="polite">
          Subtotal: {subtotals.map((item) => `${item.label} ${new Intl.NumberFormat().format(item.value)}`).join(' · ')}
        </span>
      )}
      {pagination && <span className="rd-mac-grid__pageinfo">Displaying {first} - {last} of {total}</span>}
    </div>
  );
}
