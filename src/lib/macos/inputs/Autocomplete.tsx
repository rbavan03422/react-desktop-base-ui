import * as React from 'react';
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { cx } from '../../common';


export type AutocompleteProps = Omit<React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Root>, 'items' | 'children'> & {
  items: string[];
  placeholder?: string;
  emptyText?: React.ReactNode;
  className?: string;
};

export function Autocomplete({ items, placeholder, emptyText = 'No suggestions', className, ...rest }: AutocompleteProps) {
  return (
    <BaseAutocomplete.Root items={items} {...rest}>
      <div className={cx('rd-mac rd-mac-combobox', className)} >
        <BaseAutocomplete.Input placeholder={placeholder} className="rd-mac-combobox__input" />
      </div>
      <BaseAutocomplete.Portal>
        <BaseAutocomplete.Positioner className="rd-mac-positioner" sideOffset={4}>
          <BaseAutocomplete.Popup className="rd-mac rd-mac-popup" >
            <BaseAutocomplete.Empty className="rd-mac-empty">{emptyText}</BaseAutocomplete.Empty>
            <BaseAutocomplete.List className="rd-mac-list">
              {(item: string) => (
                <BaseAutocomplete.Item key={item} value={item} className="rd-mac-item rd-mac-item--plain">{item}</BaseAutocomplete.Item>
              )}
            </BaseAutocomplete.List>
          </BaseAutocomplete.Popup>
        </BaseAutocomplete.Positioner>
      </BaseAutocomplete.Portal>
    </BaseAutocomplete.Root>
  );
}
