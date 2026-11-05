import * as React from 'react';
import { PercentCell } from './PercentCell';
import { RatingStars } from './RatingStars';
import type { GridColumn } from './types';
import { columnName, defaultRender } from './utils';

/** Display content of a cell, by column `render` or `type`. */
export function renderCell<T>(col: GridColumn<T>, row: T): React.ReactNode {
  const value = (row as any)[col.field];
  if (col.render) return col.render(value, row);
  if (col.type === 'percent') return <PercentCell value={value} max={col.max} decimals={col.decimals} label={columnName(col)} />;
  if (col.type === 'rating') return <RatingStars value={value} max={col.max} />;
  return defaultRender(value);
}
