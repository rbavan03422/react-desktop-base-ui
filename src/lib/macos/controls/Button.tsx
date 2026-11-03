import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cx } from '../../common';

export interface ButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseButton>, 'color' | 'className'> {
  color?: 'default' | 'blue' | 'red';
  push?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color = 'default', push, className, ...rest }, ref) => (
    <BaseButton
      ref={ref}
      className={cx('rd-mac rd-mac-button', className)}
      data-color={color}
      data-push={push ? '' : undefined}
      {...rest}
    />
  )
);
Button.displayName = 'Button';
