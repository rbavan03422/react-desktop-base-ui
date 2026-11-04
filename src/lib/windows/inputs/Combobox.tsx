import * as React from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type ComboboxProps = Omit<React.ComponentPropsWithoutRef<typeof BaseCombobox.Root>, 'items' | 'children'> & {
  items: string[];
  placeholder?: string;
  emptyText?: React.ReactNode;
  className?: string;
} & Themed;

export function Combobox({ theme, color, items, placeholder, emptyText = 'No results', className, ...rest }: ComboboxProps) {
  return (
    <BaseCombobox.Root items={items} {...rest}>
      <div className={cx('rd-win rd-win-combobox', className)} {...themed(theme, color)}>
        <BaseCombobox.Input placeholder={placeholder} className="rd-win-combobox__input" />
        <BaseCombobox.Clear className="rd-win-combobox__clear" aria-label="Clear">×</BaseCombobox.Clear>
        <BaseCombobox.Trigger className="rd-win-combobox__trigger" aria-label="Open list"><svg viewBox="0 0 12 8" width="10" height="7" aria-hidden><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg></BaseCombobox.Trigger>
      </div>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner className="rd-win-positioner" sideOffset={4}>
          <BaseCombobox.Popup className="rd-win rd-win-popup" {...themed(theme, color)}>
            <BaseCombobox.Empty className="rd-win-empty">{emptyText}</BaseCombobox.Empty>
            <BaseCombobox.List className="rd-win-list">
              {(item: string) => (
                <BaseCombobox.Item key={item} value={item} className="rd-win-item">
                  <BaseCombobox.ItemIndicator className="rd-win-item__indicator"><svg viewBox="0 0 10 10" width="10" height="10" aria-hidden><path d="M1.5 5.3l2.3 2.3L8.5 2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></BaseCombobox.ItemIndicator>
                  <span>{item}</span>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}
