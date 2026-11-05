export type PaletteColor = 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success';

export const isPaletteColor = (color?: string): color is PaletteColor =>
  color === 'primary' || color === 'secondary' || color === 'warning' ||
  color === 'error' || color === 'info' || color === 'success';