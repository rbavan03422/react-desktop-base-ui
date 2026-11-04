import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';
import { renderEntries, type MenuEntry } from './entries';

export type MenubarMenu = { label: React.ReactNode; items: MenuEntry[] };

export type MenubarProps = Omit<React.ComponentPropsWithoutRef<typeof BaseMenubar>, 'className' | 'children'> & {
  menus: MenubarMenu[];
  className?: string;
} & Themed;

export function Menubar({ theme, color, menus, className, ...rest }: MenubarProps) {
  const tp = themed(theme, color);
  return (
    <BaseMenubar className={cx('rd-win rd-win-menubar', className)} {...tp} {...rest}>
      {menus.map((menu, i) => (
        <BaseMenu.Root key={i}>
          <BaseMenu.Trigger className="rd-win-menubar__trigger">{menu.label}</BaseMenu.Trigger>
          <BaseMenu.Portal>
            <BaseMenu.Positioner className="rd-win-positioner" align="start" sideOffset={2}>
              <BaseMenu.Popup className="rd-win rd-win-popup rd-win-menu" {...tp}>
                {renderEntries(BaseMenu, menu.items, tp)}
              </BaseMenu.Popup>
            </BaseMenu.Positioner>
          </BaseMenu.Portal>
        </BaseMenu.Root>
      ))}
    </BaseMenubar>
  );
}
