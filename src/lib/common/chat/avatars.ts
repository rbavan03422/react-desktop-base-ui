const PALETTE = ['#0a84ff', '#af52de', '#ff9500', '#30b350', '#ff3b30', '#32ade6', '#5e5ce6', '#c93400'];

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';

/** Deterministic SVG avatar (data URI) so the demo needs no image assets. */
export function avatarFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const color = PALETTE[hash % PALETTE.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="${color}"/>` +
    `<text x="48" y="48" dy=".35em" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="38" font-weight="600" fill="#fff">${initials(name)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
