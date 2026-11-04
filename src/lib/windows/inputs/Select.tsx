import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export interface SelectOption { value: string; label: React.ReactNode }

export type SelectProps = Omit<React.ComponentPropsWithoutRef<typeof BaseSelect.Root>, 'items' | 'children'> & {
  items: SelectOption[];
  placeholder?: React.ReactNode;
  className?: string;
} & Themed;

export function Select({ theme, color, items, placeholder, className, ...rest }: SelectProps) {
  return (
    <BaseSelect.Root items={items} {...rest}>
      <BaseSelect.Trigger className={cx('rd-win rd-win-select', className)} {...themed(theme, color)}>
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon className="rd-win-select__icon"><svg viewBox="0 0 12 8" width="10" height="7" aria-hidden><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg></BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="rd-win-positioner" sideOffset={4} alignItemWithTrigger={false}>
          <BaseSelect.Popup className="rd-win rd-win-popup" {...themed(theme, color)}>
            <BaseSelect.List className="rd-win-list">
              {items.map((item) => (
                <BaseSelect.Item key={item.value} value={item.value} className="rd-win-item">
                  <BaseSelect.ItemIndicator className="rd-win-item__indicator"><svg viewBox="0 0 10 10" width="10" height="10" aria-hidden><path d="M1.5 5.3l2.3 2.3L8.5 2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></BaseSelect.ItemIndicator>
                  <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
