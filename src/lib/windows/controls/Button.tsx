import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'color' | 'className'>, Themed {
  push?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ theme, color, push, className, style, ...rest }, ref) => {
    const t = themed(theme, color, style as React.CSSProperties);
    return (
      <BaseButton
        ref={ref}
        className={cx('rd-win rd-win-button', className)}
        data-accent={color ? '' : undefined}
        data-push={push ? '' : undefined}
        {...t}
        {...rest}
      />
    );
  }
);
Button.displayName = 'Button';
