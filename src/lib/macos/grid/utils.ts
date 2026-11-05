import type { GridColumn, GridEditor } from './types';

export type Draft = Record<string, unknown>;

export const columnName = (c: GridColumn<any>) => c.ariaLabel ?? (typeof c.header === 'string' ? c.header : c.field);
const editorType = (e: GridEditor) => e.type ?? 'text';

/** Starting values for the editor fields (numbers are edited as strings so "1." can be typed). */
export function initialDraft<T>(columns: GridColumn<T>[], row: T): Draft {
  const draft: Draft = {};
  for (const c of columns) {
    if (!c.editor) continue;
    const v = (row as any)[c.field];
    draft[c.field] = editorType(c.editor) === 'boolean' ? !!v : v == null ? '' : String(v);
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
    out[c.field] = t === 'number' ? (raw === '' ? null : Number(raw)) : t === 'boolean' ? !!raw : String(raw ?? '');
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
    if (t === 'number') {
      const n = raw === '' ? null : Number(raw);
      if (n === null) { if (ed.required) err = `${name} is required`; }
      else if (Number.isNaN(n)) err = `${name} must be a number`;
      else if (ed.min !== undefined && n < ed.min) err = `${name} must be at least ${ed.min}`;
      else if (ed.max !== undefined && n > ed.max) err = `${name} must be at most ${ed.max}`;
      else { const r = ed.validate?.(n, row); if (typeof r === 'string') err = r; }
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
