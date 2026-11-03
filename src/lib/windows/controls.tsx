import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Input } from '@base-ui/react/input';
import { Progress } from '@base-ui/react/progress';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { cx } from '../common';
import { themed, type Theme } from './shared';

interface Themed { theme?: Theme; color?: string }

/* ---------- Button ---------- */
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

/* ---------- Checkbox ---------- */
export interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>, 'className' | 'children'>, Themed {
  label?: React.ReactNode;
  className?: string;
}
export function Checkbox({ label, theme, color, className, style, ...rest }: CheckboxProps) {
  return (
    <label className={cx('rd-win rd-win-choice', className)} {...themed(theme, color)}>
      <BaseCheckbox.Root className="rd-win-checkbox" {...rest}>
        <BaseCheckbox.Indicator className="rd-win-checkbox__mark">
          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden>
            <path d="M2 6.2l2.6 2.6L10 3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label != null && <span className="rd-win-choice__label">{label}</span>}
    </label>
  );
}

/* ---------- Radio ---------- */
export interface RadioGroupProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseRadioGroup>, 'className'>, Themed {
  className?: string;
}
export function RadioGroup({ theme, color, className, style, ...rest }: RadioGroupProps) {
  return <BaseRadioGroup className={cx('rd-win rd-win-radiogroup', className)} {...themed(theme, color)} {...rest} />;
}
export interface RadioProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'className' | 'children'>, Themed {
  label?: React.ReactNode;
  className?: string;
}
export function Radio({ label, theme, color, className, ...rest }: RadioProps) {
  return (
    <label className={cx('rd-win rd-win-choice', className)} {...themed(theme, color)}>
      <BaseRadio.Root className="rd-win-radio" {...rest}>
        <BaseRadio.Indicator className="rd-win-radio__dot" />
      </BaseRadio.Root>
      {label != null && <span className="rd-win-choice__label">{label}</span>}
    </label>
  );
}

/* ---------- TextInput ---------- */
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

/* ---------- ProgressCircle ---------- */
export interface ProgressCircleProps extends Themed {
  size?: number;
  /** 0-100 for determinate; omit for the indeterminate ring. */
  value?: number | null;
  className?: string;
}
export function ProgressCircle({ size = 40, value, theme, color, className }: ProgressCircleProps) {
  const det = typeof value === 'number';
  const r = 16, c = 2 * Math.PI * r;
  return (
    <Progress.Root
      value={det ? value! : null}
      className={cx('rd-win rd-win-progress', className)}
      {...themed(theme, color, { width: size, height: size })}
    >
      <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden className={det ? undefined : 'rd-win-progress__spin'}>
        <circle cx="20" cy="20" r={r} fill="none" strokeWidth="4" className="rd-win-progress__track" />
        <circle
          cx="20" cy="20" r={r} fill="none" strokeWidth="4" strokeLinecap="butt" className="rd-win-progress__bar"
          strokeDasharray={det ? c : `${c * 0.28} ${c}`}
          strokeDashoffset={det ? c * (1 - value! / 100) : 0}
          transform="rotate(-90 20 20)"
        />
      </svg>
    </Progress.Root>
  );
}
