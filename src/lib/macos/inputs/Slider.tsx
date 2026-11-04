import * as React from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cx } from '../../common';


export type SliderProps = Omit<React.ComponentPropsWithoutRef<typeof BaseSlider.Root>, 'className' | 'children'> & {
  className?: string;
  /** Accessible names for each thumb (a range slider has two). */
  thumbLabels?: string[];
};

export function Slider({ className, thumbLabels, ...rest }: SliderProps) {
  const initial = rest.value ?? rest.defaultValue;
  const count = Array.isArray(initial) ? initial.length : 1;
  return (
    <BaseSlider.Root className={cx('rd-mac rd-mac-slider', className)}  {...rest}>
      <BaseSlider.Control className="rd-mac-slider__control">
        <BaseSlider.Track className="rd-mac-slider__track">
          <BaseSlider.Indicator className="rd-mac-slider__indicator" />
          {Array.from({ length: count }, (_, i) => (
            <BaseSlider.Thumb
              key={i}
              index={count > 1 ? i : undefined}
              aria-label={thumbLabels?.[i]}
              className="rd-mac-slider__thumb"
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
