import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cx } from '../../common';
import type { PaletteColor } from '../../common/palette';

export type { PaletteColor };

export interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'color' | 'className'> {
  color?: 'default' | 'blue' | 'red' | PaletteColor;
  push?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color = 'default', push, className, ...rest }, ref) => {
    const normalizedColor = color === 'blue' ? 'primary' : color === 'red' ? 'error' : color;
    return (
      <BaseButton
        ref={ref}
        className={cx('rd-mac rd-mac-button', className)}
        data-color={normalizedColor}
        data-push={push ? '' : undefined}
        {...rest}
      />
    );
  }
);
Button.displayName = 'Button';
