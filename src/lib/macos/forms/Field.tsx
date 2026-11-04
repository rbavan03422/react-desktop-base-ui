import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { cx } from '../../common';


export type FieldProps = Omit<React.ComponentPropsWithoutRef<typeof BaseField.Root>, 'className' | 'children'> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** When set, the error is shown (use with your own validation). */
  error?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function Field({ label, description, error, className, children, ...rest }: FieldProps) {
  return (
    <BaseField.Root className={cx('rd-mac rd-mac-field', className)}  {...rest}>
      {label != null && <BaseField.Label className="rd-mac-field__label">{label}</BaseField.Label>}
      {children}
      {description != null && <BaseField.Description className="rd-mac-field__description">{description}</BaseField.Description>}
      {error != null && <BaseField.Error match className="rd-mac-field__error">{error}</BaseField.Error>}
    </BaseField.Root>
  );
}
