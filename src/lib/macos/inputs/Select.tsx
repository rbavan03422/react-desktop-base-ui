import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { cx } from '../../common';


export interface SelectOption { value: string; label: React.ReactNode }

export type SelectProps = Omit<React.ComponentPropsWithoutRef<typeof BaseSelect.Root>, 'items' | 'children'> & {
  items: SelectOption[];
  placeholder?: React.ReactNode;
  className?: string;
};

export function Select({ items, placeholder, className, ...rest }: SelectProps) {
  return (
    <BaseSelect.Root items={items} {...rest}>
      <BaseSelect.Trigger className={cx('rd-mac rd-mac-select', className)} >
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon className="rd-mac-select__icon"><svg viewBox="0 0 10 14" width="9" height="12" aria-hidden><path d="M2 5.2L5 2.2l3 3M2 8.8l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="rd-mac-positioner" sideOffset={4}>
          <BaseSelect.Popup className="rd-mac rd-mac-popup" >
            <BaseSelect.List className="rd-mac-list">
              {items.map((item) => (
                <BaseSelect.Item key={item.value} value={item.value} className="rd-mac-item">
                  <BaseSelect.ItemIndicator className="rd-mac-item__indicator"><svg viewBox="0 0 10 10" width="10" height="10" aria-hidden><path d="M1.5 5.3l2.3 2.3L8.5 2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></BaseSelect.ItemIndicator>
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
