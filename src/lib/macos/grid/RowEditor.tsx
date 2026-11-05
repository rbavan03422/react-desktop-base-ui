import * as React from 'react';
import { Input } from '@base-ui/react/input';
import { cx } from '../../common';
import type { Themed } from '../shared';
import { Button, Checkbox } from '../controls';
import { Select } from '../inputs';
import type { GridColumn, GridEditor } from './types';
import { columnName, defaultRender, type Draft } from './utils';

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;

export type RowEditorProps<T> = {
  columns: GridColumn<T>[];
  row: T;
  rowIndex: number;
  draft: Draft;
  errors: Record<string, string>;
  blockError: string | null;
  focusKey?: string;
  updateText: string;
  cancelText: string;
  onChange: (field: string, value: unknown) => void;
  onUpdate: () => void;
  onCancel: () => void;
} & Themed;

/**
 * The inline row editor: the row itself turns into a floating editor (one field per column)
 * with an Update / Cancel bar beneath it, like Ext.grid.plugin.RowEditing.
 */
export function RowEditor<T>({
  theme, columns, row, rowIndex, draft, errors, blockError, focusKey, updateText, cancelText, onChange, onUpdate, onCancel,
}: RowEditorProps<T>) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const errorLines = [...Object.values(errors), ...(blockError ? [blockError] : [])];
  const invalid = Object.keys(errors).length > 0;

  // Focus the field of the column that was clicked (or the first field) and bring the row into view.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const within = (col: string) => ['input', 'button', '[role="combobox"]'].map((s) => `[data-col="${CSS.escape(col)}"] ${s}`).join(', ');
    const target =
      (focusKey ? root.querySelector<HTMLElement>(within(focusKey)) : null) ??
      root.querySelector<HTMLElement>('[data-col] input, [data-col] button, [data-col] [role="combobox"]');
    target?.focus();
    if (target instanceof HTMLInputElement) target.select();
    root.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Centre the button bar in the visible area, and put it above the row when there is no room below.
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    const scroller = root?.closest<HTMLElement>('.rd-mac-grid__scroller');
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
      const items = Array.from(root.querySelectorAll<HTMLElement>('input:not([disabled]), button:not([disabled]), [role="combobox"]'));
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
        <Select theme={theme} className="rd-mac-grid__select" aria-label={name} items={e.options} value={draft[key] as string} onValueChange={(v) => onChange(key, v)} />
      );
    }
    if (type === 'boolean') {
      return <Checkbox aria-label={name} checked={!!draft[key]} onCheckedChange={(v) => onChange(key, v)} />;
    }
    if (type === 'number') {
      const e = ed as Extract<GridEditor<T>, { type: 'number' }>;
      return (
        <Input
          {...common} className="rd-mac-grid__input" type="number" inputMode="decimal" min={e.min} max={e.max} step={e.step}
          value={String(draft[key] ?? '')} onChange={(ev) => onChange(key, ev.target.value)}
        />
      );
    }
    const e = ed as Extract<GridEditor<T>, { type?: 'text' | 'date' }>;
    return (
      <Input
        {...common} className="rd-mac-grid__input" type={type === 'date' ? 'date' : 'text'}
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
      className="rd-mac-grid__row rd-mac-grid__row--editing"
      onKeyDown={onKeyDown}
    >
      {columns.map((c) => (
        <div
          key={c.field}
          role="gridcell"
          data-col={c.field}
          className={cx('rd-mac-grid__cell', c.editor && 'rd-mac-grid__cell--editor')}
          style={{ justifyContent: JUSTIFY[c.align ?? 'left'] }}
        >
          {c.editor ? renderField(c, c.editor) : c.render ? c.render((row as any)[c.field], row) : defaultRender((row as any)[c.field])}
        </div>
      ))}
      <div ref={barRef} className="rd-mac-grid__editbar" role="group" aria-label="Row editor actions">
        {errorLines.length > 0 && (
          <ul className="rd-mac-grid__errors" role="alert">
            {errorLines.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        )}
        <div className="rd-mac-grid__editbtns">
          <Button color="blue" disabled={invalid} onClick={onUpdate}>{updateText}</Button>
          <Button onClick={onCancel}>{cancelText}</Button>
        </div>
      </div>
    </div>
  );
}
