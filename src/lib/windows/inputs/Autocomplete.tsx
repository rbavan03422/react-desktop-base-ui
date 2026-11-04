import * as React from 'react';
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type AutocompleteProps = Omit<React.ComponentPropsWithoutRef<typeof BaseAutocomplete.Root>, 'items' | 'children'> & {
  items: string[];
  placeholder?: string;
  emptyText?: React.ReactNode;
  className?: string;
} & Themed;

export function Autocomplete({ theme, color, items, placeholder, emptyText = 'No suggestions', className, ...rest }: AutocompleteProps) {
  return (
    <BaseAutocomplete.Root items={items} {...rest}>
      <div className={cx('rd-win rd-win-combobox', className)} {...themed(theme, color)}>
        <BaseAutocomplete.Input placeholder={placeholder} className="rd-win-combobox__input" />
      </div>
      <BaseAutocomplete.Portal>
        <BaseAutocomplete.Positioner className="rd-win-positioner" sideOffset={4}>
          <BaseAutocomplete.Popup className="rd-win rd-win-popup" {...themed(theme, color)}>
            <BaseAutocomplete.Empty className="rd-win-empty">{emptyText}</BaseAutocomplete.Empty>
            <BaseAutocomplete.List className="rd-win-list">
              {(item: string) => (
                <BaseAutocomplete.Item key={item} value={item} className="rd-win-item rd-win-item--plain">{item}</BaseAutocomplete.Item>
              )}
            </BaseAutocomplete.List>
          </BaseAutocomplete.Popup>
        </BaseAutocomplete.Positioner>
      </BaseAutocomplete.Portal>
    </BaseAutocomplete.Root>
  );
}
