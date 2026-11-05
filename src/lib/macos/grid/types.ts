import type * as React from 'react';

export interface GridOption { value: string; label: React.ReactNode }

/** Editor for a column (like ExtJS `editor: { xtype, allowBlank, ... }`). Columns without one are read-only in the row editor. */
export type GridEditor<T = any> =
  | { type?: 'text'; required?: boolean; placeholder?: string; maxLength?: number; validate?: (value: string, row: T) => true | string }
  | { type: 'number'; required?: boolean; min?: number; max?: number; step?: number; validate?: (value: number | null, row: T) => true | string }
  | { type: 'date'; required?: boolean; validate?: (value: string, row: T) => true | string }
  | { type: 'select'; options: GridOption[]; required?: boolean }
  | { type: 'boolean' };

export interface GridColumn<T = any> {
  /** Key of the row property shown (and edited) in this column. */
  field: keyof T & string;
  header: React.ReactNode;
  /** Accessible name / error-summary name when `header` is not a string. */
  ariaLabel?: string;
  /** Fixed width in px. Without it the column flexes (`flex`, default 1) with a `minWidth` (default 80). */
  width?: number;
  flex?: number;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortValue?: (row: T) => string | number | boolean | null | undefined;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  editor?: GridEditor<T>;
}

export type GridSort = { field: string; dir: 'asc' | 'desc' } | null;

export interface GridBeforeEditEvent<T> { rowId: string; row: T; columnKey?: string }
export interface GridEditEvent<T> {
  rowId: string;
  row: T;
  /** Values of the editable columns before the edit. */
  originalValues: Partial<T>;
  /** Values of all editable columns after the edit. */
  newValues: Partial<T>;
  /** Only the values that actually changed. */
  changes: Partial<T>;
}
export interface GridCancelEditEvent<T> { rowId: string; row: T }

export interface DataGridHandle {
  /** Open the row editor (like ExtJS `plugin.startEdit(record, column)`). Returns false if it could not start. */
  startEdit(rowId: string, columnKey?: string): boolean;
  /** Validate and commit the open editor. Returns false if it is invalid or rejected. */
  completeEdit(): boolean;
  cancelEdit(): void;
  getEditingId(): string | null;
}
