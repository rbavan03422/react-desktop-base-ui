import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { cx } from '../../common';

const CheckIcon = () => (
  <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden>
    <path d="M1.5 5.3l2.3 2.3L8.5 2.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, 'className' | 'children'> {
  label?: React.ReactNode;
  className?: string;
}

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
  return (
    <label className={cx('rd-mac rd-mac-choice', className)}>
      <BaseCheckbox.Root className="rd-mac-checkbox" {...rest}>
        <BaseCheckbox.Indicator className="rd-mac-checkbox__mark"><CheckIcon /></BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label != null && <span className="rd-mac-choice__label">{label}</span>}
    </label>
  );
}
