import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';
import { renderEntries, type MenuEntry } from './entries';

export type MenuProps = {
  /** The element that opens the menu. */
  trigger: React.ReactElement;
  items: MenuEntry[];
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
} & Themed;

export function Menu({ theme, trigger, items, side, align, open, onOpenChange, className }: MenuProps) {
  const tp = themed(theme);
  return (
    <BaseMenu.Root open={open} onOpenChange={onOpenChange}>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner className="rd-mac-positioner" side={side} align={align} sideOffset={4}>
          <BaseMenu.Popup className={cx('rd-mac rd-mac-popup rd-mac-menu', className)} {...tp}>
            {renderEntries(BaseMenu, items, tp)}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
