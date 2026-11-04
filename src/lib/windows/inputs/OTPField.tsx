import * as React from 'react';
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type OTPFieldProps = Omit<React.ComponentPropsWithoutRef<typeof BaseOTPField.Root>, 'className' | 'children' | 'length'> & {
  /** Number of character slots (default 6). */
  length?: number;
  /** Insert a separator after every N slots (e.g. 3 renders "123 – 456"). */
  groupSize?: number;
  /** Accessible name for the first slot (not needed inside <Field> or with a <label htmlFor>). */
  label?: string;
  className?: string;
} & Themed;

/** One-time code input: one box per character, with paste and SMS autofill support. */
export function OTPField({ theme, color, length = 6, groupSize, label, className, ...rest }: OTPFieldProps) {
  return (
    <BaseOTPField.Root length={length} className={cx('rd-win rd-win-otp', className)} {...themed(theme, color)} {...rest}>
      {Array.from({ length }, (_, i) => (
        <React.Fragment key={i}>
          {groupSize !== undefined && i > 0 && i % groupSize === 0 && (
            <BaseOTPField.Separator className="rd-win-otp__separator">–</BaseOTPField.Separator>
          )}
          <BaseOTPField.Input
            className="rd-win-otp__input"
            aria-label={i === 0 ? label : `Character ${i + 1} of ${length}`}
          />
        </React.Fragment>
      ))}
    </BaseOTPField.Root>
  );
}
