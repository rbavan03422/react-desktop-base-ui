import type { CSSProperties } from 'react';

export type Theme = 'light' | 'dark';

/** Props shared by themed macOS components. */
export interface Themed { theme?: Theme }

/** data-attribute (+ optional style) that selects the light / dark tokens for an element and its subtree. */
export function themed(theme?: Theme, style?: CSSProperties) {
  return style ? { 'data-rd-theme': theme, style } : { 'data-rd-theme': theme };
}
