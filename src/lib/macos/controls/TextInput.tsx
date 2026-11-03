import * as React from 'react';
import { Input } from '@base-ui/react/input';
import { cx } from '../../common';

export interface TextInputProps extends Omit<React.ComponentPropsWithoutRef<typeof Input>, 'size' | 'className'> {
  label?: React.ReactNode;
  rounded?: boolean;
  size?: 'small' | 'default' | 'large';
  className?: string;
}

export function TextInput({ label, rounded, size = 'default', className, ...rest }: TextInputProps) {
  const input = (
    <Input
      className={cx('rd-mac-input', rounded && 'rd-mac-input--rounded', !label && className)}
      data-size={size}
      {...rest}
    />
  );
  if (label == null) return <span className="rd-mac rd-mac-inputwrap">{input}</span>;
  return (
    <label className={cx('rd-mac rd-mac-field', className)}>
      <span className="rd-mac-field__label">{label}</span>
      {input}
    </label>
  );
}
