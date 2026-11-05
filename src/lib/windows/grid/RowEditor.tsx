import * as React from 'react';
import { Input } from '@base-ui/react/input';
import { cx } from '../../common';
import type { Themed } from '../shared';
import { Button, Checkbox } from '../controls';
import { Select } from '../inputs';
import { RatingInput } from './RatingInput';
import type { GridColumn, GridEditor } from './types';
import { columnName, type Draft } from './utils';

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
const TABBABLE = 'input:not([disabled]), button:not([disabled]), [role="combobox"], [role="radio"]';

export type RowEditorProps<T> = {
  columns: GridColumn<T>[];
  row: T;
  rowIndex: number;
  displayRow: number;
  draft: Draft;
  errors: Record<string, string>;
  blockError: string | null;
  focusKey?: string;
  updateText: string;
  cancelText: string;
  /** Display content for columns that have no editor. */
  renderCell: (column: GridColumn<T>, row: T) => React.ReactNode;
  onChange: (field: string, value: unknown) => void;
  onUpdate: () => void;
  onCancel: () => void;
} & Themed;

/**
 * The inline row editor: the row itself turns into a floating editor (one field per column)
 * with an Update / Cancel bar beneath it, like Ext.grid.plugin.RowEditing.
 */
export function RowEditor<T>({
  theme, color, columns, row, rowIndex, displayRow, draft, errors, blockError, focusKey, updateText, cancelText, renderCell, onChange, onUpdate, onCancel,
}: RowEditorProps<T>) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const errorLines = [...Object.values(errors), ...(blockError ? [blockError] : [])];
  const invalid = Object.keys(errors).length > 0;

  // Focus the field of the column that was clicked (or the first field) and bring the row into view.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const within = (col: string) => ['input', 'button', '[role="combobox"]', '[role="radio"]'].map((s) => `[data-col="${CSS.escape(col)}"] ${s}`).join(', ');
    const target =
      (focusKey ? root.querySelector<HTMLElement>(within(focusKey)) : null) ??
      root.querySelector<HTMLElement>('[data-col] input:not([aria-hidden]), [data-col] button, [data-col] [role="combobox"], [data-col] [role="radio"]');
    target?.focus();
    if (target instanceof HTMLInputElement) target.select();
    root.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Centre the button bar in the visible area, and put it above the row when there is no room below.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    const scroller = root?.closest<HTMLElement>('.rd-win-grid__scroller');
    if (!root || !bar || !scroller) return;
    const place = () => {
      bar.style.left = `${scroller.scrollLeft + scroller.clientWidth / 2}px`;
      const rowBottom = root.getBoundingClientRect().bottom;
      bar.dataset.flip = rowBottom + bar.offsetHeight > scroller.getBoundingClientRect().bottom ? 'true' : 'false';
    };
    place();
    scroller.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      scroller.removeEventListener('scroll', place);
      window.removeEventListener('resize', place);
    };
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    const target = e.target as HTMLElement;
    // Popups (select lists) render in portals: leave their keys alone.
    if (!root || !root.contains(target)) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onCancel();
    } else if (e.key === 'Enter' && target.tagName !== 'BUTTON' && target.getAttribute('role') !== 'combobox') {
      e.preventDefault();
      onUpdate();
    } else if (e.key === 'Tab') {
      const items = Array.from(root.querySelectorAll<HTMLElement>(TABBABLE)).filter((el) => el.tabIndex >= 0);
      const first = items[0];
      const last = items[items.length - 1];
      if (!e.shiftKey && target === last) { e.preventDefault(); first?.focus(); }
      else if (e.shiftKey && target === first) { e.preventDefault(); last?.focus(); }
    }
  };

  const renderField = (c: GridColumn<T>, ed: GridEditor<T>) => {
    const key = c.field;
    const err = errors[key];
    const name = columnName(c);
    const common = { 'aria-label': name, 'aria-invalid': err ? true : undefined, 'data-invalid': err ? '' : undefined, title: err } as const;
    const type = ed.type ?? 'text';
    if (type === 'select') {
      const e = ed as Extract<GridEditor<T>, { type: 'select' }>;
      return (
        <Select theme={theme} color={color} className="rd-win-grid__select" aria-label={name} items={e.options} value={draft[key] as string} onValueChange={(v) => onChange(key, v)} />
      );
    }
    if (type === 'boolean') {
      return <Checkbox theme={theme} color={color} aria-label={name} checked={!!draft[key]} onCheckedChange={(v) => onChange(key, v)} />;
    }
    if (type === 'rating') {
      const e = ed as Extract<GridEditor<T>, { type: 'rating' }>;
      return <RatingInput label={name} max={e.max ?? c.max ?? 5} value={Number(draft[key]) || 0} onChange={(v) => onChange(key, v)} />;
    }
    if (type === 'number' || type === 'percent') {
      const e = ed as { min?: number; max?: number; step?: number };
      const pct = type === 'percent';
      return (
        <Input
          {...common} className="rd-win-grid__input" type="number" inputMode="decimal"
          min={pct ? 0 : e.min} max={pct ? (e.max ?? c.max ?? 100) : e.max} step={e.step ?? (pct ? 1 : undefined)}
          value={String(draft[key] ?? '')} onChange={(ev) => onChange(key, ev.target.value)}
        />
      );
    }
    const e = ed as Extract<GridEditor<T>, { type?: 'text' | 'date' }>;
    return (
      <Input
        {...common} className="rd-win-grid__input" type={type === 'date' ? 'date' : 'text'}
        placeholder={'placeholder' in e ? e.placeholder : undefined} maxLength={'maxLength' in e ? e.maxLength : undefined}
        value={String(draft[key] ?? '')} onChange={(ev) => onChange(key, ev.target.value)}
      />
    );
  };

  return (
    <div
      ref={rootRef}
      role="row"
      aria-rowindex={rowIndex}
      aria-selected
      aria-label="Edit row"
      className="rd-win-grid__row rd-win-grid__row--editing"
      style={{ gridRow: displayRow }}
      onKeyDown={onKeyDown}
    >
      {columns.map((c) => (
        <div
          key={c.field}
          role="gridcell"
          data-col={c.field}
          className={cx('rd-win-grid__cell', c.editor && 'rd-win-grid__cell--editor', c.field === '__check' && 'rd-win-grid__cell--check')}
          style={{ justifyContent: JUSTIFY[c.align ?? 'left'] }}
        >
          {c.editor ? renderField(c, c.editor) : renderCell(c, row)}
        </div>
      ))}
      <div ref={barRef} className="rd-win-grid__editbar" role="group" aria-label="Row editor actions">
        {errorLines.length > 0 && (
          <ul className="rd-win-grid__errors" role="alert">
            {errorLines.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        )}
        <div className="rd-win-grid__editbtns">
          <Button theme={theme} color={color ?? '#0067c0'} disabled={invalid} onClick={onUpdate}>{updateText}</Button>
          <Button theme={theme} onClick={onCancel}>{cancelText}</Button>
        </div>
      </div>
    </div>
  );
}
