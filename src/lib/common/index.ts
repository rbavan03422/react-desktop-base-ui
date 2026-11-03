import type { CSSProperties } from 'react';

export const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');

type Size = number | string;
export interface LayoutProps {
  width?: Size; height?: Size;
  margin?: Size; marginTop?: Size; marginRight?: Size; marginBottom?: Size; marginLeft?: Size;
  padding?: Size; paddingTop?: Size; paddingRight?: Size; paddingBottom?: Size; paddingLeft?: Size;
  hidden?: boolean;
  layout?: 'horizontal' | 'vertical';
  horizontalAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
}

const BOX = [
  'width', 'height', 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
] as const;

/** Turns react-desktop style layout props into a CSS style object and returns the remaining props. */
export function splitLayout<T extends LayoutProps>(props: T) {
  const { hidden, layout, horizontalAlignment: h, verticalAlignment: v, ...rest } = props as any;
  const style: CSSProperties = {};
  for (const k of BOX) {
    if (rest[k] !== undefined) (style as any)[k] = rest[k];
    delete rest[k];
  }
  if (layout || h || v) {
    const row = layout === 'horizontal';
    const j = (x?: string) => (x === 'center' ? 'center' : x === 'right' || x === 'bottom' ? 'flex-end' : 'flex-start');
    style.display = 'flex';
    style.flexDirection = row ? 'row' : 'column';
    style.justifyContent = j(row ? h : v);
    style.alignItems = j(row ? v : h);
  }
  if (hidden) style.display = 'none';
  return [style, rest as Omit<T, keyof LayoutProps>] as const;
}

export const cssVar = (name: string, value?: string): CSSProperties =>
  (value ? { [name]: value } : {}) as CSSProperties;
