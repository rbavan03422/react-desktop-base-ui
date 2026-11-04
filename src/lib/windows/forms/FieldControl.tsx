import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { cx } from '../../common';

export type FieldControlProps = Omit<React.ComponentPropsWithoutRef<typeof BaseField.Control>, 'className'> & {
  className?: string;
};

/** A text input that wires itself to the surrounding <Field> (label, description, validity). */
export function FieldControl({ className, ...rest }: FieldControlProps) {
  return <BaseField.Control className={cx('rd-win-input', className)} {...rest} />;
}
