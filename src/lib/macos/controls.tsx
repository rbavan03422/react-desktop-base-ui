import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Input } from '@base-ui/react/input';
import { Progress } from '@base-ui/react/progress';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { Toggle } from '@base-ui/react/toggle';
import { cx } from '../common';

/* ---------- Button ---------- */
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

/* ---------- Checkbox ---------- */
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

/* ---------- Radio ---------- */
export interface RadioGroupProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseRadioGroup>, 'className'> {
  className?: string;
}
export function RadioGroup({ className, ...rest }: RadioGroupProps) {
  return <BaseRadioGroup className={cx('rd-mac rd-mac-radiogroup', className)} {...rest} />;
}
export interface RadioProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseRadio.Root>, 'className' | 'children'> {
  label?: React.ReactNode;
  className?: string;
}
export function Radio({ label, className, ...rest }: RadioProps) {
  return (
    <label className={cx('rd-mac rd-mac-choice', className)}>
      <BaseRadio.Root className="rd-mac-radio" {...rest}>
        <BaseRadio.Indicator className="rd-mac-radio__dot" />
      </BaseRadio.Root>
      {label != null && <span className="rd-mac-choice__label">{label}</span>}
    </label>
  );
}

/* ---------- TextInput ---------- */
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

/* ---------- SearchField ---------- */
export interface SearchFieldProps extends Omit<TextInputProps, 'label' | 'rounded' | 'size'> {
  onClear?: () => void;
}
export function SearchField({ onClear, className, value, defaultValue, onChange, ...rest }: SearchFieldProps) {
  const [inner, setInner] = React.useState(String(defaultValue ?? ''));
  const current = value !== undefined ? String(value) : inner;
  return (
    <span className={cx('rd-mac rd-mac-search', className)}>
      <svg className="rd-mac-search__icon" viewBox="0 0 16 16" width="12" height="12" aria-hidden>
        <circle cx="6.5" cy="6.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <Input
        type="text"
        role="searchbox"
        className="rd-mac-search__input"
        value={current}
        onChange={(e) => { setInner(e.target.value); onChange?.(e); }}
        {...rest}
      />
      {current !== '' && (
        <button type="button" aria-label="Clear" className="rd-mac-search__clear" onClick={() => { setInner(''); onClear?.(); }}>×</button>
      )}
    </span>
  );
}

/* ---------- SegmentedControl ---------- */
export interface SegmentedControlItemProps {
  title?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  children?: React.ReactNode;
}
/** Marker component: SegmentedControl reads its props. */
export const SegmentedControlItem: React.FC<SegmentedControlItemProps> = () => null;

export interface SegmentedControlProps { box?: boolean; className?: string; style?: React.CSSProperties; children?: React.ReactNode }
export function SegmentedControl({ box, className, style, children }: SegmentedControlProps) {
  const items = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<SegmentedControlItemProps>[];
  const active = items.find((i) => i.props.selected);
  return (
    <div className={cx('rd-mac rd-mac-segmented', box && 'rd-mac-segmented--box', className)} style={style}>
      <div role="group" className="rd-mac-segmented__bar">
        {items.map((it, i) => (
          <Toggle
            key={it.key ?? i}
            className="rd-mac-segment"
            pressed={!!it.props.selected}
            onPressedChange={() => it.props.onSelect?.()}
          >
            {it.props.title}
          </Toggle>
        ))}
      </div>
      {box && active && <div className="rd-mac-segmented__box">{active.props.children}</div>}
    </div>
  );
}

/* ---------- ProgressCircle ---------- */
export interface ProgressCircleProps {
  size?: number;
  /** 0-100 for determinate; omit for the indeterminate spinner. */
  value?: number | null;
  className?: string;
}
export function ProgressCircle({ size = 25, value, className }: ProgressCircleProps) {
  const det = typeof value === 'number';
  return (
    <Progress.Root value={det ? value! : null} className={cx('rd-mac rd-mac-progress', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i} x1="12" y1="2.5" x2="12" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${i * 30} 12 12)`}
            className={det ? undefined : 'rd-mac-progress__tick'}
            style={det ? { opacity: i < (value! / 100) * 12 ? 1 : 0.2 } : { animationDelay: `${i / 12 - 1}s` }}
          />
        ))}
      </svg>
    </Progress.Root>
  );
}
