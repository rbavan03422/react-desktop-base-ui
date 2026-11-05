import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cx } from '../../common';
import { isPaletteColor, type PaletteColor } from '../../common/palette';
import { themed, type Themed } from '../shared';

export type { PaletteColor };

export interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'color' | 'className'>, Omit<Themed, 'color'> {
  color?: PaletteColor | string;
  push?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ theme, color, push, className, style, ...rest }, ref) => {
    const paletteColor = isPaletteColor(color) ? color : undefined;
    const t = themed(theme, paletteColor ? undefined : color, style as React.CSSProperties);
    return (
      <BaseButton
        ref={ref}
        className={cx('rd-win rd-win-button', className)}
        data-accent={color && !paletteColor ? '' : undefined}
        data-color={paletteColor}
        data-push={push ? '' : undefined}
        {...t}
        {...rest}
      />
    );
  }
);
Button.displayName = 'Button';
