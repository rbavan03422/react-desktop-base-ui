import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import type { GridColumn, GridSort } from './types';

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;

export function GridHeader<T>({ columns, sort, onSort }: {
  columns: GridColumn<T>[];
  sort: GridSort;
  onSort: (field: string) => void;
}) {
  return (
    <div className="rd-mac-grid__header" role="row" aria-rowindex={1}>
      {columns.map((c) => {
        const dir = sort?.field === c.field ? sort.dir : null;
        return (
          <div
            key={c.field}
            role="columnheader"
            aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : c.sortable ? 'none' : undefined}
            className="rd-mac-grid__hcell"
            style={{ justifyContent: JUSTIFY[c.align ?? 'left'] }}
          >
            {c.sortable ? (
              <BaseButton className="rd-mac-grid__headbtn" onClick={() => onSort(c.field)}>
                <span className="rd-mac-grid__headtext">{c.header}</span>
                <span className="rd-mac-grid__sort" aria-hidden>{dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : ''}</span>
              </BaseButton>
            ) : (
              <span className="rd-mac-grid__headtext">{c.header}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
