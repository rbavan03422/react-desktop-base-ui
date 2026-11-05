import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import type { GridColumn, GridColumnGroup, GridSort } from './types';
import { CHECK_FIELD, columnName, type HeaderCell } from './utils';

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
const clampWidth = (c: GridColumn<any>, w: number) => Math.round(Math.max(c.minWidth ?? 40, Math.min(c.maxWidth ?? 1200, w)));

export function GridHeader<T>({ cells, depth, sort, widths, checkboxHeader, onSort, onResize, onResizeState }: {
  cells: HeaderCell[];
  depth: number;
  sort: GridSort;
  widths: Record<string, number>;
  /** Content of the leading checkbox column header (select all). */
  checkboxHeader?: React.ReactNode;
  onSort: (field: string) => void;
  /** width null = back to the configured width */
  onResize: (field: string, width: number | null, final: boolean) => void;
  onResizeState: (resizing: boolean) => void;
}) {
  const drag = React.useRef<{ col: GridColumn<any>; startX: number; startW: number } | null>(null);
  const levels = Array.from({ length: depth }, (_, i) => i + 1);

  const cellWidth = (el: Element) => (el.closest('[role="columnheader"]') as HTMLElement).getBoundingClientRect().width;

  return (
    <div className="rd-win-grid__header">
      {levels.map((level) => (
        <div key={level} role="row" aria-rowindex={level} className="rd-win-grid__hrow">
          {cells.filter((cell) => cell.level === level).map((cell) => {
            const place: React.CSSProperties = {
              gridColumn: `${cell.start + 1} / span ${cell.span}`,
              gridRow: `${cell.level} / span ${cell.rows}`,
            };
            if (!cell.col) {
              return (
                <div key={cell.key} role="columnheader" aria-colspan={cell.span} className="rd-win-grid__hcell rd-win-grid__hcell--group" style={place}>
                  <span className="rd-win-grid__headtext">{(cell.node as GridColumnGroup<T>).header}</span>
                </div>
              );
            }
            const c = cell.col;
            const dir = sort?.field === c.field ? sort.dir : null;
            const isCheck = c.field === CHECK_FIELD;
            return (
              <div
                key={cell.key}
                role="columnheader"
                aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : c.sortable ? 'none' : undefined}
                className={'rd-win-grid__hcell' + (isCheck ? ' rd-win-grid__hcell--check' : '')}
                style={{ ...place, justifyContent: JUSTIFY[c.align ?? 'left'] }}
              >
                {isCheck ? (
                  checkboxHeader
                ) : c.sortable ? (
                  <BaseButton className="rd-win-grid__headbtn" onClick={() => onSort(c.field)}>
                    <span className="rd-win-grid__headtext">{c.header}</span>
                    <span className="rd-win-grid__sort" aria-hidden>{dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : ''}</span>
                  </BaseButton>
                ) : (
                  <span className="rd-win-grid__headtext">{c.header}</span>
                )}
                {!isCheck && c.resizable !== false && (
                  <div
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={`Resize ${columnName(c)} column`}
                    aria-valuenow={widths[c.field]}
                    tabIndex={0}
                    className="rd-win-grid__resizer"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      drag.current = { col: c, startX: e.clientX, startW: cellWidth(e.currentTarget) };
                      e.currentTarget.setPointerCapture(e.pointerId);
                      onResizeState(true);
                    }}
                    onPointerMove={(e) => {
                      const d = drag.current;
                      if (d) onResize(d.col.field, clampWidth(d.col, d.startW + e.clientX - d.startX), false);
                    }}
                    onPointerUp={(e) => {
                      const d = drag.current;
                      if (!d) return;
                      drag.current = null;
                      onResizeState(false);
                      onResize(d.col.field, clampWidth(d.col, d.startW + e.clientX - d.startX), true);
                    }}
                    onPointerCancel={() => { drag.current = null; onResizeState(false); }}
                    onDoubleClick={() => onResize(c.field, null, true)}
                    onKeyDown={(e) => {
                      const step = e.shiftKey ? 30 : 10;
                      if (e.key === 'ArrowLeft') { e.preventDefault(); onResize(c.field, clampWidth(c, cellWidth(e.currentTarget) - step), true); }
                      else if (e.key === 'ArrowRight') { e.preventDefault(); onResize(c.field, clampWidth(c, cellWidth(e.currentTarget) + step), true); }
                      else if (e.key === 'Home') { e.preventDefault(); onResize(c.field, null, true); }
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
