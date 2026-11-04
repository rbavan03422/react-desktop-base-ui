import * as React from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

const SWIPE = { left: 'left', right: 'right', top: 'up', bottom: 'down' } as const;

export type DrawerProps = {
  /** Edge the drawer slides in from (default "right"). */
  side?: 'left' | 'right' | 'top' | 'bottom';
  trigger?: React.ReactElement;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  className?: string;
} & Themed;

export function Drawer({ theme, color, side = 'right', trigger, title, description, children, open, defaultOpen, onOpenChange, modal, className }: DrawerProps) {
  return (
    <BaseDrawer.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal} swipeDirection={SWIPE[side]}>
      {trigger && <BaseDrawer.Trigger render={trigger} />}
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="rd-win-drawer__backdrop" />
        <BaseDrawer.Viewport className={cx('rd-win-drawer__viewport', `rd-win-drawer__viewport--${side}`)}>
          <BaseDrawer.Popup className={cx('rd-win rd-win-drawer', className)} data-side={side} {...themed(theme, color)}>
            <BaseDrawer.Content className="rd-win-drawer__content">
              {title != null && <BaseDrawer.Title className="rd-win-drawer__title">{title}</BaseDrawer.Title>}
              {description != null && <BaseDrawer.Description className="rd-win-drawer__description">{description}</BaseDrawer.Description>}
              {children}
            </BaseDrawer.Content>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
