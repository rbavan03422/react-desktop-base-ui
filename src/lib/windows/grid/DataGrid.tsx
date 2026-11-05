import * as React from 'react';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';
import { Checkbox } from '../controls';
import { GridHeader } from './GridHeader';
import { GridPager } from './GridPager';
import { RowEditor } from './RowEditor';
import { renderCell } from './renderCell';
import type {
  DataGridHandle, GridBeforeEditEvent, GridCancelEditEvent, GridColumn, GridColumnItem, GridEditEvent, GridSort,
} from './types';
import {
  CHECK_COLUMN, CHECK_FIELD, compareValues, computeErrors, initialDraft, layoutHeader, pickChanges, toValues, type Draft,
} from './utils';

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;

export type DataGridProps<T> = {
  /** Columns, optionally nested in groups for multi-level headers. */
  columns: GridColumnItem<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  height?: number | string;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null) => void;

  /** Adds a leading checkbox column with a select-all header (like Ext.selection.CheckboxModel). */
  checkboxSelection?: boolean;
  checkedIds?: string[];
  defaultCheckedIds?: string[];
  onCheckedChange?: (ids: string[]) => void;

  /** Paging: set `pageSize` / `defaultPageSize` to show the paging toolbar. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (size: number) => void;
  /** Shows a "Rows" selector with these sizes. */
  pageSizeOptions?: number[];
  /** Server-side paging: total row count. `rows` is then treated as the current page and is not sliced. */
  total?: number;

  /** Initial user column widths (px) by field. */
  defaultColumnWidths?: Record<string, number>;
  /** Fires when a column is resized (width in px, or null when reset to its configured width). */
  onColumnResize?: (field: string, width: number | null) => void;

  /** Clicks needed to start editing a row (ExtJS `clicksToEdit`). Default 2. */
  clicksToEdit?: 1 | 2;
  /**
   * ExtJS `autoCancel`. true (default): starting to edit another row cancels the pending edit.
   * false: an invalid edit blocks the switch, a valid one is committed first.
   */
  autoCancel?: boolean;
  /** Defaults to true when any column has an `editor`. */
  editable?: boolean;
  /** ExtJS `beforeedit`: return false to prevent editing. */
  onBeforeEdit?: (e: GridBeforeEditEvent<T>) => boolean | void;
  /** ExtJS `validateedit`: return false or an error message to reject the update. */
  onValidateEdit?: (e: GridEditEvent<T>) => boolean | string | void;
  /** ExtJS `edit`: the update was accepted. Apply `e.changes` to your rows here. */
  onEdit?: (e: GridEditEvent<T>) => void;
  /** ExtJS `canceledit`. */
  onCancelEdit?: (e: GridCancelEditEvent<T>) => void;
  updateText?: string;
  cancelText?: string;
  emptyText?: React.ReactNode;
  className?: string;
} & Themed;

type EditState<T> = { id: string; row: T; focusKey?: string; draft: Draft };

function DataGridInner<T extends object>(
  {
    theme, color, columns: columnItems, rows, getRowId, height = 300, selectedId, defaultSelectedId = null, onSelectedChange,
    checkboxSelection, checkedIds, defaultCheckedIds, onCheckedChange,
    page: pageProp, defaultPage = 1, onPageChange, pageSize: pageSizeProp, defaultPageSize, onPageSizeChange, pageSizeOptions, total: totalProp,
    defaultColumnWidths, onColumnResize,
    clicksToEdit = 2, autoCancel = true, editable, onBeforeEdit, onValidateEdit, onEdit, onCancelEdit,
    updateText = 'Update', cancelText = 'Cancel', emptyText = 'No rows', className,
  }: DataGridProps<T>,
  ref: React.ForwardedRef<DataGridHandle>,
) {
  const layout = React.useMemo(
    () => layoutHeader<T>(checkboxSelection ? [CHECK_COLUMN as GridColumn<T>, ...columnItems] : columnItems),
    [columnItems, checkboxSelection],
  );
  const columns = layout.leaves;
  const canEdit = editable ?? columns.some((c) => c.editor);

  const [sort, setSort] = React.useState<GridSort>(null);
  const [widths, setWidths] = React.useState<Record<string, number>>(defaultColumnWidths ?? {});
  const [resizing, setResizing] = React.useState(false);
  const [innerSel, setInnerSel] = React.useState<string | null>(defaultSelectedId);
  const selected = selectedId !== undefined ? selectedId : innerSel;
  const [innerChecked, setInnerChecked] = React.useState<string[]>(defaultCheckedIds ?? []);
  const checkedSet = React.useMemo(() => new Set(checkedIds ?? innerChecked), [checkedIds, innerChecked]);
  const [edit, setEdit] = React.useState<EditState<T> | null>(null);
  const [blockError, setBlockError] = React.useState<string | null>(null);
  const rowRefs = React.useRef(new Map<string, HTMLDivElement>());

  const sortedRows = React.useMemo(() => {
    const col = sort && columns.find((c) => c.field === sort.field);
    if (!sort || !col) return rows;
    const val = (r: T) => (col.sortValue ? col.sortValue(r) : (r as any)[col.field]);
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => dir * compareValues(val(a), val(b)));
  }, [rows, sort, columns]);

  // paging
  const paged = pageSizeProp !== undefined || defaultPageSize !== undefined;
  const server = totalProp !== undefined;
  const [innerSize, setInnerSize] = React.useState(defaultPageSize ?? 25);
  const [innerPage, setInnerPage] = React.useState(defaultPage);
  const size = pageSizeProp ?? innerSize;
  const total = server ? totalProp : sortedRows.length;
  const pageCount = paged ? Math.max(1, Math.ceil(total / size)) : 1;
  const page = Math.min(Math.max(1, pageProp ?? innerPage), pageCount);
  const visibleRows = paged && !server ? sortedRows.slice((page - 1) * size, page * size) : sortedRows;
  const rowOffset = paged && !server ? (page - 1) * size : 0;

  const errors = React.useMemo(() => (edit ? computeErrors(columns, edit.draft, edit.row) : {}), [edit, columns]);

  const select = (id: string | null) => {
    if (selectedId === undefined) setInnerSel(id);
    onSelectedChange?.(id);
  };

  const setPageValue = (p: number) => {
    const next = Math.min(Math.max(1, p), pageCount);
    if (pageProp === undefined) setInnerPage(next);
    if (next !== page) onPageChange?.(next);
  };

  // checkboxes
  const setChecked = (next: Set<string>) => {
    const ids = Array.from(next);
    if (checkedIds === undefined) setInnerChecked(ids);
    onCheckedChange?.(ids);
  };
  const toggleChecked = (id: string) => {
    const next = new Set(checkedSet);
    if (next.has(id)) next.delete(id); else next.add(id);
    setChecked(next);
  };
  const pageIds = visibleRows.map(getRowId);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => checkedSet.has(id));
  const someChecked = pageIds.some((id) => checkedSet.has(id));
  const toggleAll = () => {
    const next = new Set(checkedSet);
    if (allChecked) pageIds.forEach((id) => next.delete(id));
    else pageIds.forEach((id) => next.add(id));
    setChecked(next);
  };

  // editing
  const cancelEdit = () => {
    if (!edit) return;
    onCancelEdit?.({ rowId: edit.id, row: edit.row });
    setEdit(null);
    setBlockError(null);
  };

  const completeEdit = (): boolean => {
    if (!edit) return true;
    if (Object.keys(errors).length) return false;
    const newValues = toValues(columns, edit.draft);
    const originalValues = Object.fromEntries(
      columns.filter((c) => c.editor).map((c) => [c.field, (edit.row as any)[c.field]]),
    ) as Partial<T>;
    const evt: GridEditEvent<T> = { rowId: edit.id, row: edit.row, originalValues, newValues, changes: pickChanges(newValues, edit.row) };
    const verdict = onValidateEdit?.(evt);
    if (verdict === false || typeof verdict === 'string') {
      setBlockError(typeof verdict === 'string' ? verdict : 'The update was rejected');
      return false;
    }
    if (Object.keys(evt.changes).length) onEdit?.(evt);
    setEdit(null);
    setBlockError(null);
    return true;
  };

  const startEdit = (id: string, focusKey?: string): boolean => {
    if (!canEdit) return false;
    const row = rows.find((r) => getRowId(r) === id);
    if (!row) return false;
    if (edit) {
      if (edit.id === id) { setEdit({ ...edit, focusKey }); return true; }
      if (autoCancel) cancelEdit();
      else if (!completeEdit()) return false;
    }
    if (onBeforeEdit?.({ rowId: id, row, columnKey: focusKey }) === false) return false;
    if (paged && !server) {
      const index = sortedRows.findIndex((r) => getRowId(r) === id);
      if (index >= 0) setPageValue(Math.floor(index / size) + 1);
    }
    setEdit({ id, row, focusKey, draft: initialDraft(columns, row) });
    setBlockError(null);
    select(id);
    return true;
  };

  const goToPage = (p: number) => {
    if (edit) cancelEdit();
    setPageValue(p);
  };
  const changePageSize = (n: number) => {
    if (edit) cancelEdit();
    if (pageSizeProp === undefined) setInnerSize(n);
    onPageSizeChange?.(n);
    setPageValue(1);
  };

  React.useImperativeHandle(ref, () => ({
    startEdit,
    completeEdit,
    cancelEdit,
    getEditingId: () => edit?.id ?? null,
    goToPage,
    getPage: () => page,
  }));

  // Give focus back to the row when the editor closes.
  const editingId = edit?.id ?? null;
  const prevEditing = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (prevEditing.current && !editingId) rowRefs.current.get(prevEditing.current)?.focus();
    prevEditing.current = editingId;
  }, [editingId]);

  const onSort = (field: string) =>
    setSort((s) => (s?.field !== field ? { field, dir: 'asc' } : s.dir === 'asc' ? { field, dir: 'desc' } : null));

  const onResize = (field: string, width: number | null, final: boolean) => {
    setWidths((w) => {
      if (width !== null) return { ...w, [field]: width };
      const next = { ...w };
      delete next[field];
      return next;
    });
    if (final) onColumnResize?.(field, width);
  };

  const colFromEvent = (e: React.MouseEvent) =>
    (e.target as HTMLElement).closest('[data-col]')?.getAttribute('data-col') ?? undefined;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (edit || (e.target as HTMLElement).closest('[role="columnheader"], [role="navigation"]')) return;
    const ids = visibleRows.map(getRowId);
    if (!ids.length) return;
    const i = selected ? ids.indexOf(selected) : -1;
    const go = (n: number) => {
      const id = ids[Math.max(0, Math.min(ids.length - 1, n))];
      e.preventDefault();
      select(id);
      const el = rowRefs.current.get(id);
      el?.focus();
      el?.scrollIntoView?.({ block: 'nearest' });
    };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i < 0 ? 0 : i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(ids.length - 1);
    else if ((e.key === 'Enter' || e.key === 'F2') && selected) { e.preventDefault(); startEdit(selected); }
    else if (e.key === ' ' && checkboxSelection && selected && (e.target as HTMLElement).getAttribute('role') === 'row') { e.preventDefault(); toggleChecked(selected); }
  };

  const template = columns
    .map((c) => {
      const w = widths[c.field] ?? c.width;
      return w ? `${w}px` : `minmax(${c.minWidth ?? 80}px, ${c.flex ?? 1}fr)`;
    })
    .join(' ');
  const minWidth = columns.reduce((sum, c) => sum + (widths[c.field] ?? c.width ?? c.minWidth ?? 80), 0);

  // display content for the row editor's read-only cells
  const renderDisplay = (c: GridColumn<T>, r: T) =>
    c.field === CHECK_FIELD ? (
      <Checkbox theme={theme} color={color} aria-label="Row selected" disabled checked={checkedSet.has(getRowId(r))} />
    ) : (
      renderCell(c, r)
    );

  return (
    <div
      role="grid"
      aria-rowcount={total + layout.depth}
      aria-colcount={columns.length}
      aria-multiselectable={checkboxSelection || undefined}
      className={cx('rd-win rd-win-grid', className)}
      data-resizing={resizing ? '' : undefined}
      {...themed(theme, color, { height })}
      onKeyDown={onKeyDown}
    >
      <div className="rd-win-grid__scroller">
        <div
          className="rd-win-grid__inner"
          style={{ minWidth, ['--rd-win-grid-cols' as string]: template, ['--rd-win-grid-hrows' as string]: layout.depth } as React.CSSProperties}
        >
          <GridHeader<T>
            cells={layout.cells}
            depth={layout.depth}
            sort={sort}
            widths={widths}
            onSort={onSort}
            onResize={onResize}
            onResizeState={setResizing}
            checkboxHeader={
              checkboxSelection ? (
                <Checkbox theme={theme} color={color}
                  aria-label="Select all rows on this page"
                  checked={allChecked}
                  indeterminate={someChecked && !allChecked}
                  onCheckedChange={toggleAll}
                />
              ) : undefined
            }
          />
          <div className="rd-win-grid__rows" role="rowgroup">
            {visibleRows.map((row, i) => {
              const id = getRowId(row);
              const rowIndex = layout.depth + rowOffset + i + 1;
              if (edit?.id === id) {
                return (
                  <RowEditor<T>
                    key={id}
                    theme={theme} color={color} columns={columns} row={edit.row} rowIndex={rowIndex} draft={edit.draft} errors={errors} blockError={blockError}
                    focusKey={edit.focusKey} updateText={updateText} cancelText={cancelText} renderCell={renderDisplay}
                    onChange={(field, value) => { setEdit((s) => (s ? { ...s, draft: { ...s.draft, [field]: value } } : s)); setBlockError(null); }}
                    onUpdate={completeEdit} onCancel={cancelEdit}
                  />
                );
              }
              const isSel = selected === id;
              const isChecked = checkedSet.has(id);
              return (
                <div
                  key={id}
                  ref={(el) => { if (el) rowRefs.current.set(id, el); else rowRefs.current.delete(id); }}
                  role="row"
                  aria-rowindex={rowIndex}
                  aria-selected={isSel}
                  data-checked={isChecked ? '' : undefined}
                  tabIndex={isSel || (selected == null && i === 0) ? 0 : -1}
                  className="rd-win-grid__row"
                  onClick={(e) => { select(id); if (clicksToEdit === 1) startEdit(id, colFromEvent(e)); }}
                  onDoubleClick={(e) => { if (clicksToEdit === 2) startEdit(id, colFromEvent(e)); }}
                >
                  {columns.map((c) =>
                    c.field === CHECK_FIELD ? (
                      <div
                        key={c.field}
                        role="gridcell"
                        data-col={c.field}
                        className="rd-win-grid__cell rd-win-grid__cell--check"
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox theme={theme} color={color} aria-label="Select row" checked={isChecked} onCheckedChange={() => toggleChecked(id)} />
                      </div>
                    ) : (
                      <div key={c.field} role="gridcell" data-col={c.field} className="rd-win-grid__cell" style={{ justifyContent: JUSTIFY[c.align ?? 'left'] }}>
                        {renderCell(c, row)}
                      </div>
                    ),
                  )}
                </div>
              );
            })}
            {visibleRows.length === 0 && <div className="rd-win-grid__empty">{emptyText}</div>}
          </div>
        </div>
      </div>
      {paged && (
        <GridPager
          theme={theme} color={color} page={page} pageCount={pageCount} pageSize={size} pageSizeOptions={pageSizeOptions} total={total}
          onPage={goToPage} onPageSize={pageSizeOptions ? changePageSize : undefined}
        />
      )}
    </div>
  );
}

/** Data grid with an ExtJS 4 style inline row editor (double-click a row to edit it). */
export const DataGrid = React.forwardRef(DataGridInner) as <T extends object>(
  props: DataGridProps<T> & { ref?: React.Ref<DataGridHandle> },
) => React.ReactElement;
