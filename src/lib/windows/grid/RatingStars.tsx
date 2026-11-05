import * as React from 'react';
import { StarIcon } from './StarIcon';

/** Read-only star rating shown in a grid cell. */
export function RatingStars({ value, max = 5 }: { value: unknown; max?: number }) {
  const n = Math.max(0, Math.min(max, Math.round(Number(value) || 0)));
  return (
    <span className="rd-win-grid__stars" role="img" aria-label={`${n} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => <StarIcon key={i} filled={i < n} />)}
    </span>
  );
}
