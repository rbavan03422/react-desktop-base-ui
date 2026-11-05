import type { GridColumn, GridColumnGroup, GridColumnItem, GridEditor } from './types';

export type Draft = Record<string, unknown>;

export const columnName = (c: GridColumn<any>) => c.ariaLabel ?? (typeof c.header === 'string' ? c.header : c.field);
const editorType = (e: GridEditor) => e.type ?? 'text';

/** Internal leading column used for row checkboxes. */
export const CHECK_FIELD = '__check';
export const CHECK_COLUMN: GridColumn<any> = { field: CHECK_FIELD, header: '', width: 40, align: 'center', resizable: false };

export interface HeaderCell {
  key: string;
  node: GridColumnItem<any>;
  /** Set for leaf columns, undefined for group headers. */
  col?: GridColumn<any>;
  /** 1-based header row the cell starts in. */
  level: number;
  /** Number of header rows the cell spans. */
  rows: number;
  /** 0-based first leaf column and number of leaf columns spanned. */
  start: number;
  span: number;
}

const isGroup = (n: GridColumnItem<any>): n is GridColumnGroup<any> => 'columns' in n;

/** Flattens nested column groups into leaf columns and header cells placed on a grid (rows x leaf columns). */
export function layoutHeader<T>(items: GridColumnItem<T>[]) {
  const depthOf = (n: GridColumnItem<T>): number => (isGroup(n) ? 1 + Math.max(0, ...n.columns.map(depthOf)) : 1);
  const depth = Math.max(1, ...items.map(depthOf));
  const leaves: GridColumn<T>[] = [];
  const cells: HeaderCell[] = [];
  const walk = (nodes: GridColumnItem<T>[], level: number) => {
    for (const n of nodes) {
      if (isGroup(n)) {
        const start = leaves.length;
        walk(n.columns, level + 1);
        cells.push({ key: `g:${level}:${start}`, node: n, level, rows: 1, start, span: Math.max(1, leaves.length - start) });
      } else {
        cells.push({ key: n.field, node: n, col: n, level, rows: depth - level + 1, start: leaves.length, span: 1 });
        leaves.push(n);
      }
    }
  };
  walk(items, 1);
  return { leaves, cells, depth };
}

/** Starting values for the editor fields (numbers are edited as strings so "1." can be typed). */
export function initialDraft<T>(columns: GridColumn<T>[], row: T): Draft {
  const draft: Draft = {};
  for (const c of columns) {
    if (!c.editor) continue;
    const v = (row as any)[c.field];
    const t = editorType(c.editor);
    draft[c.field] = t === 'boolean' ? !!v : t === 'rating' ? Number(v) || 0 : v == null ? '' : String(v);
  }
  return draft;
}

/** Converts the editor drafts back to typed values. */
export function toValues<T>(columns: GridColumn<T>[], draft: Draft): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const c of columns) {
    if (!c.editor) continue;
    const raw = draft[c.field];
    const t = editorType(c.editor);
    out[c.field] =
      t === 'number' || t === 'percent' ? (raw === '' ? null : Number(raw))
      : t === 'rating' ? Number(raw) || 0
      : t === 'boolean' ? !!raw
      : String(raw ?? '');
  }
  return out as Partial<T>;
}

/** field -> message for every invalid editor field. */
export function computeErrors<T>(columns: GridColumn<T>[], draft: Draft, row: T): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const c of columns) {
    const ed = c.editor as any;
    if (!ed) continue;
    const t = editorType(ed);
    const name = columnName(c);
    const raw = draft[c.field];
    let err: string | null = null;
    if (t === 'number' || t === 'percent') {
      const n = raw === '' ? null : Number(raw);
      const min = t === 'percent' ? 0 : ed.min;
      const max = t === 'percent' ? (ed.max ?? c.max ?? 100) : ed.max;
      if (n === null) { if (ed.required) err = `${name} is required`; }
      else if (Number.isNaN(n)) err = `${name} must be a number`;
      else if (min !== undefined && n < min) err = `${name} must be at least ${min}`;
      else if (max !== undefined && n > max) err = `${name} must be at most ${max}`;
      else { const r = ed.validate?.(n, row); if (typeof r === 'string') err = r; }
    } else if (t === 'rating') {
      if (ed.required && !(Number(raw) > 0)) err = `${name} is required`;
    } else if (t !== 'boolean') {
      const s = String(raw ?? '');
      if (s === '') { if (ed.required) err = `${name} is required`; }
      else { const r = ed.validate?.(s, row); if (typeof r === 'string') err = r; }
    }
    if (err) errors[c.field] = err;
  }
  return errors;
}

export function pickChanges<T>(newValues: Partial<T>, row: T): Partial<T> {
  const changes: Record<string, unknown> = {};
  for (const k of Object.keys(newValues)) {
    const a = (newValues as any)[k] ?? null;
    const b = (row as any)[k] ?? null;
    if (a !== b) changes[k] = (newValues as any)[k];
  }
  return changes as Partial<T>;
}

export function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

export function defaultRender(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? '✓' : '';
  return String(value);
}
