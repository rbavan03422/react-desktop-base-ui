import * as React from 'react';
import type { Menu as BaseMenu } from '@base-ui/react/menu';

/** Theme attributes forwarded to popups, which render in a portal outside the themed tree. */
export type PopupTheme = { style?: React.CSSProperties; 'data-rd-theme'?: string };

/** The Menu / ContextMenu parts used to render entries (both namespaces share this API). */
export type MenuParts = Pick<
  typeof BaseMenu,
  'Portal' | 'Positioner' | 'Popup' | 'Item' | 'Separator' | 'CheckboxItem' | 'CheckboxItemIndicator' |
  'RadioGroup' | 'RadioItem' | 'RadioItemIndicator' | 'Group' | 'GroupLabel' | 'SubmenuRoot' | 'SubmenuTrigger'
>;

export type MenuEntry =
  | { type?: 'item'; label: React.ReactNode; shortcut?: string; disabled?: boolean; onClick?: () => void }
  | { type: 'separator' }
  | { type: 'checkbox'; label: React.ReactNode; checked?: boolean; defaultChecked?: boolean; disabled?: boolean; onCheckedChange?: (checked: boolean) => void }
  | { type: 'radio-group'; value?: string; defaultValue?: string; onValueChange?: (value: any) => void; items: { value: string; label: React.ReactNode }[] }
  | { type: 'group'; label: React.ReactNode; items: MenuEntry[] }
  | { type: 'submenu'; label: React.ReactNode; disabled?: boolean; items: MenuEntry[] };

export function renderEntries(M: MenuParts, entries: MenuEntry[], tp: PopupTheme = {}): React.ReactNode {
  return entries.map((entry, i) => {
    switch (entry.type) {
      case 'separator':
        return <M.Separator key={i} className="rd-mac-separator" />;
      case 'checkbox':
        return (
          <M.CheckboxItem
            key={i} className="rd-mac-item" checked={entry.checked} defaultChecked={entry.defaultChecked}
            disabled={entry.disabled} onCheckedChange={entry.onCheckedChange}
          >
            <M.CheckboxItemIndicator className="rd-mac-item__indicator"><svg viewBox="0 0 10 10" width="10" height="10" aria-hidden><path d="M1.5 5.3l2.3 2.3L8.5 2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></M.CheckboxItemIndicator>
            <span className="rd-mac-item__label">{entry.label}</span>
          </M.CheckboxItem>
        );
      case 'radio-group':
        return (
          <M.RadioGroup key={i} value={entry.value} defaultValue={entry.defaultValue} onValueChange={entry.onValueChange}>
            {entry.items.map((it) => (
              <M.RadioItem key={it.value} value={it.value} className="rd-mac-item">
                <M.RadioItemIndicator className="rd-mac-item__indicator">●</M.RadioItemIndicator>
                <span className="rd-mac-item__label">{it.label}</span>
              </M.RadioItem>
            ))}
          </M.RadioGroup>
        );
      case 'group':
        return (
          <M.Group key={i}>
            <M.GroupLabel className="rd-mac-menu__grouplabel">{entry.label}</M.GroupLabel>
            {renderEntries(M, entry.items, tp)}
          </M.Group>
        );
      case 'submenu':
        return (
          <M.SubmenuRoot key={i}>
            <M.SubmenuTrigger className="rd-mac-item" disabled={entry.disabled}>
              <span className="rd-mac-item__label">{entry.label}</span>
              <span className="rd-mac-item__chevron" aria-hidden>›</span>
            </M.SubmenuTrigger>
            <M.Portal>
              <M.Positioner className="rd-mac-positioner" sideOffset={-4}>
                <M.Popup className="rd-mac rd-mac-popup rd-mac-menu" {...tp}>{renderEntries(M, entry.items, tp)}</M.Popup>
              </M.Positioner>
            </M.Portal>
          </M.SubmenuRoot>
        );
      default:
        return (
          <M.Item key={i} className="rd-mac-item" disabled={entry.disabled} onClick={entry.onClick}>
            <span className="rd-mac-item__label">{entry.label}</span>
            {entry.shortcut && <span className="rd-mac-item__shortcut">{entry.shortcut}</span>}
          </M.Item>
        );
    }
  });
}
