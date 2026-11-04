import * as React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type NumberFieldProps = Omit<React.ComponentPropsWithoutRef<typeof BaseNumberField.Root>, 'className' | 'children'> & {
  label?: React.ReactNode;
  placeholder?: string;
  className?: string;
} & Themed;

export function NumberField({ theme, color, label, placeholder, className, ...rest }: NumberFieldProps) {
  const field = (
    <BaseNumberField.Root className={cx('rd-win rd-win-number', className)} {...themed(theme, color)} {...rest}>
      <BaseNumberField.Group className="rd-win-number__group">
        <BaseNumberField.Input className="rd-win-number__input" placeholder={placeholder} />
        <div className="rd-win-number__spin">
          <BaseNumberField.Increment className="rd-win-number__btn" aria-label="Increase"><svg viewBox="0 0 8 5" width="8" height="5" aria-hidden><path d="M1 4.2L4 1.2l3 3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></BaseNumberField.Increment>
          <BaseNumberField.Decrement className="rd-win-number__btn" aria-label="Decrease"><svg viewBox="0 0 8 5" width="8" height="5" aria-hidden><path d="M1 .8l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></BaseNumberField.Decrement>
        </div>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
  if (label == null) return field;
  return (
    <label className="rd-win rd-win-field" {...themed(theme, color)}>
      <span className="rd-win-field__label">{label}</span>
      {field}
    </label>
  );
}
