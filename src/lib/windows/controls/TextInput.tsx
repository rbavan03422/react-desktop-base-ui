import * as React from 'react';
import { Input } from '@base-ui/react/input';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export interface TextInputProps extends Omit<React.ComponentPropsWithoutRef<typeof Input>, 'className'>, Themed {
  label?: React.ReactNode;
  className?: string;
}

export function TextInput({ label, theme, color, className, ...rest }: TextInputProps) {
  return (
    <label className={cx('rd-win rd-win-field', className)} {...themed(theme, color)}>
      {label != null && <span className="rd-win-field__label">{label}</span>}
      <Input className="rd-win-input" {...rest} />
    </label>
  );
}
