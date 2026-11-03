import type { CSSProperties } from 'react';
import { cssVar } from '../common';

export type Theme = 'light' | 'dark';

/** Props shared by every themed / accent-coloured Windows component. */
export interface Themed { theme?: Theme; color?: string }

/** data-attr + css var for an optionally themed / accent-coloured element. */
export function themed(theme?: Theme, color?: string, style?: CSSProperties) {
  return {
    'data-rd-theme': theme,
    style: { ...cssVar('--rd-win-accent', color), ...style } as CSSProperties,
  };
}
