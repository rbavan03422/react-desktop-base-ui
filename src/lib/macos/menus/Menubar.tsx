import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { cx } from '../../common';
import { renderEntries, type MenuEntry } from './entries';

export type MenubarMenu = { label: React.ReactNode; items: MenuEntry[] };

export type MenubarProps = Omit<React.ComponentPropsWithoutRef<typeof BaseMenubar>, 'className' | 'children'> & {
  menus: MenubarMenu[];
  className?: string;
};

export function Menubar({ menus, className, ...rest }: MenubarProps) {
  const tp = {};
  return (
    <BaseMenubar className={cx('rd-mac rd-mac-menubar', className)} {...tp} {...rest}>
      {menus.map((menu, i) => (
        <BaseMenu.Root key={i}>
          <BaseMenu.Trigger className="rd-mac-menubar__trigger">{menu.label}</BaseMenu.Trigger>
          <BaseMenu.Portal>
            <BaseMenu.Positioner className="rd-mac-positioner" align="start" sideOffset={2}>
              <BaseMenu.Popup className="rd-mac rd-mac-popup rd-mac-menu" {...tp}>
                {renderEntries(BaseMenu, menu.items, tp)}
              </BaseMenu.Popup>
            </BaseMenu.Positioner>
          </BaseMenu.Portal>
        </BaseMenu.Root>
      ))}
    </BaseMenubar>
  );
}
