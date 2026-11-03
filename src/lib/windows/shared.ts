import type { CSSProperties } from 'react';
import { cssVar } from '../common';

export type Theme = 'light' | 'dark';

/** data-attr + css var for an optionally themed / accent-coloured element. */
export function themed(theme?: Theme, color?: string, style?: CSSProperties) {
  return {
    'data-rd-theme': theme,
    style: { ...cssVar('--rd-win-accent', color), ...style } as CSSProperties,
  };
}
