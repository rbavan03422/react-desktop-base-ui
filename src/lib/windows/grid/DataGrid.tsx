import * as React from 'react';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';
import { GridHeader } from './GridHeader';
import { RowEditor } from './RowEditor';
import type {
  DataGridHandle, GridBeforeEditEvent, GridCancelEditEvent, GridColumn, GridEditEvent, GridSort,
} from './types';
import { columnName, compareValues, computeErrors, defaultRender, initialDraft, pickChanges, toValues, type Draft } from './utils';

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;

export type DataGridProps<T> = {
  columns: GridColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  height?: number | string;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null) => void;
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
    theme, color, columns, rows, getRowId, height = 300, selectedId, defaultSelectedId = null, onSelectedChange,
    clicksToEdit = 2, autoCancel = true, editable, onBeforeEdit, onValidateEdit, onEdit, onCancelEdit,
    updateText = 'Update', cancelText = 'Cancel', emptyText = 'No rows', className,
  }: DataGridProps<T>,
  ref: React.ForwardedRef<DataGridHandle>,
) {
  const canEdit = editable ?? columns.some((c) => c.editor);
  const [sort, setSort] = React.useState<GridSort>(null);
  const [innerSel, setInnerSel] = React.useState<string | null>(defaultSelectedId);
  const selected = selectedId !== undefined ? selectedId : innerSel;
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

  const errors = React.useMemo(() => (edit ? computeErrors(columns, edit.draft, edit.row) : {}), [edit, columns]);

  const select = (id: string | null) => {
    if (selectedId === undefined) setInnerSel(id);
    onSelectedChange?.(id);
  };

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
    setEdit({ id, row, focusKey, draft: initialDraft(columns, row) });
    setBlockError(null);
    select(id);
    return true;
  };

  React.useImperativeHandle(ref, () => ({
    startEdit,
    completeEdit,
    cancelEdit,
    getEditingId: () => edit?.id ?? null,
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

  const colFromEvent = (e: React.MouseEvent) =>
    (e.target as HTMLElement).closest('[data-col]')?.getAttribute('data-col') ?? undefined;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (edit || (e.target as HTMLElement).closest('[role="columnheader"]')) return;
    const ids = sortedRows.map(getRowId);
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
  };

  const template = columns.map((c) => (c.width ? `${c.width}px` : `minmax(${c.minWidth ?? 80}px, ${c.flex ?? 1}fr)`)).join(' ');
  const minWidth = columns.reduce((sum, c) => sum + (c.width ?? c.minWidth ?? 80), 0);

  return (
    <div
      role="grid"
      aria-rowcount={sortedRows.length + 1}
      aria-colcount={columns.length}
      className={cx('rd-win rd-win-grid', className)}
      {...themed(theme, color, { height })}
      onKeyDown={onKeyDown}
    >
      <div className="rd-win-grid__scroller">
        <div className="rd-win-grid__inner" style={{ minWidth, ['--rd-win-grid-cols' as string]: template } as React.CSSProperties}>
          <GridHeader columns={columns} sort={sort} onSort={onSort} />
          <div className="rd-win-grid__rows" role="rowgroup">
            {sortedRows.map((row, i) => {
              const id = getRowId(row);
              if (edit?.id === id) {
                return (
                  <RowEditor<T>
                    key={id}
                    theme={theme} color={color} columns={columns} row={edit.row} rowIndex={i + 2} draft={edit.draft} errors={errors} blockError={blockError}
                    focusKey={edit.focusKey} updateText={updateText} cancelText={cancelText}
                    onChange={(field, value) => { setEdit((s) => (s ? { ...s, draft: { ...s.draft, [field]: value } } : s)); setBlockError(null); }}
                    onUpdate={completeEdit} onCancel={cancelEdit}
                  />
                );
              }
              const isSel = selected === id;
              return (
                <div
                  key={id}
                  ref={(el) => { if (el) rowRefs.current.set(id, el); else rowRefs.current.delete(id); }}
                  role="row"
                  aria-rowindex={i + 2}
                  aria-selected={isSel}
                  tabIndex={isSel || (selected == null && i === 0) ? 0 : -1}
                  className="rd-win-grid__row"
                  onClick={(e) => { select(id); if (clicksToEdit === 1) startEdit(id, colFromEvent(e)); }}
                  onDoubleClick={(e) => { if (clicksToEdit === 2) startEdit(id, colFromEvent(e)); }}
                >
                  {columns.map((c) => (
                    <div key={c.field} role="gridcell" data-col={c.field} className="rd-win-grid__cell" style={{ justifyContent: JUSTIFY[c.align ?? 'left'] }}>
                      {c.render ? c.render((row as any)[c.field], row) : defaultRender((row as any)[c.field])}
                    </div>
                  ))}
                </div>
              );
            })}
            {sortedRows.length === 0 && <div className="rd-win-grid__empty">{emptyText}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Data grid with an ExtJS 4 style inline row editor (double-click a row to edit it). */
export const DataGrid = React.forwardRef(DataGridInner) as <T extends object>(
  props: DataGridProps<T> & { ref?: React.Ref<DataGridHandle> },
) => React.ReactElement;
