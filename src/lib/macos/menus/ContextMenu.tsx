import * as React from 'react';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { cx } from '../../common';
import { renderEntries, type MenuEntry, type MenuParts } from './entries';

export type ContextMenuProps = {
  /** Right-click (or long-press) this area to open the menu. */
  children?: React.ReactNode;
  items: MenuEntry[];
  className?: string;
  /** Class for the popup itself. */
  popupClassName?: string;
};

export function ContextMenu({ children, items, className, popupClassName }: ContextMenuProps) {
  const tp = {};
  return (
    <BaseContextMenu.Root>
      <BaseContextMenu.Trigger className={cx('rd-mac-contextarea', className)}>{children}</BaseContextMenu.Trigger>
      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner className="rd-mac-positioner">
          <BaseContextMenu.Popup className={cx('rd-mac rd-mac-popup rd-mac-menu', popupClassName)} {...tp}>
            {/* ContextMenu parts share the Menu part API */}
            {renderEntries(BaseContextMenu as unknown as MenuParts, items, tp)}
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </BaseContextMenu.Root>
  );
}
