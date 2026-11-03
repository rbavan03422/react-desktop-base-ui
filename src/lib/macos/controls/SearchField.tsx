import * as React from 'react';
import { Input } from '@base-ui/react/input';
import { cx } from '../../common';
import type { TextInputProps } from './TextInput';

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
