import * as React from 'react';
import { Button } from '@base-ui/react/button';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { StarIcon } from './StarIcon';

/** Editable star rating (a radio group: arrow keys move, click or Space picks). */
export function RatingInput({ value, max = 5, label, onChange }: {
  value: number;
  max?: number;
  label: string;
  onChange: (value: number) => void;
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  const shown = hover ?? value;
  return (
    <RadioGroup
      className="rd-win-grid__rating"
      aria-label={label}
      value={value ? String(value) : ''}
      onValueChange={(v) => onChange(Number(v))}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: max }, (_, i) => (
        <Radio.Root
          key={i}
          value={String(i + 1)}
          className="rd-win-grid__ratingstar"
          aria-label={`${i + 1} ${i === 0 ? 'star' : 'stars'}`}
          onMouseEnter={() => setHover(i + 1)}
        >
          <StarIcon filled={i < shown} />
        </Radio.Root>
      ))}
      {value > 0 && (
        <Button className="rd-win-grid__ratingclear" aria-label="Clear rating" onClick={() => onChange(0)}>×</Button>
      )}
    </RadioGroup>
  );
}
