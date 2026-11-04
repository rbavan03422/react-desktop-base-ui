import * as React from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { cx } from '../../common';


export type ComboboxProps = Omit<React.ComponentPropsWithoutRef<typeof BaseCombobox.Root>, 'items' | 'children'> & {
  items: string[];
  placeholder?: string;
  emptyText?: React.ReactNode;
  className?: string;
};

export function Combobox({ items, placeholder, emptyText = 'No results', className, ...rest }: ComboboxProps) {
  return (
    <BaseCombobox.Root items={items} {...rest}>
      <div className={cx('rd-mac rd-mac-combobox', className)} >
        <BaseCombobox.Input placeholder={placeholder} className="rd-mac-combobox__input" />
        <BaseCombobox.Clear className="rd-mac-combobox__clear" aria-label="Clear">×</BaseCombobox.Clear>
        <BaseCombobox.Trigger className="rd-mac-combobox__trigger" aria-label="Open list"><svg viewBox="0 0 10 14" width="9" height="12" aria-hidden><path d="M2 5.2L5 2.2l3 3M2 8.8l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></BaseCombobox.Trigger>
      </div>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner className="rd-mac-positioner" sideOffset={4}>
          <BaseCombobox.Popup className="rd-mac rd-mac-popup" >
            <BaseCombobox.Empty className="rd-mac-empty">{emptyText}</BaseCombobox.Empty>
            <BaseCombobox.List className="rd-mac-list">
              {(item: string) => (
                <BaseCombobox.Item key={item} value={item} className="rd-mac-item">
                  <BaseCombobox.ItemIndicator className="rd-mac-item__indicator"><svg viewBox="0 0 10 10" width="10" height="10" aria-hidden><path d="M1.5 5.3l2.3 2.3L8.5 2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></BaseCombobox.ItemIndicator>
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
