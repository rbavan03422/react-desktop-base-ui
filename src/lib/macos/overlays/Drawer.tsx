import * as React from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { cx } from '../../common';


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
};

export function Drawer({ side = 'right', trigger, title, description, children, open, defaultOpen, onOpenChange, modal, className }: DrawerProps) {
  return (
    <BaseDrawer.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal} swipeDirection={SWIPE[side]}>
      {trigger && <BaseDrawer.Trigger render={trigger} />}
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="rd-mac-drawer__backdrop" />
        <BaseDrawer.Viewport className={cx('rd-mac-drawer__viewport', `rd-mac-drawer__viewport--${side}`)}>
          <BaseDrawer.Popup className={cx('rd-mac rd-mac-drawer', className)} data-side={side} >
            <BaseDrawer.Content className="rd-mac-drawer__content">
              {title != null && <BaseDrawer.Title className="rd-mac-drawer__title">{title}</BaseDrawer.Title>}
              {description != null && <BaseDrawer.Description className="rd-mac-drawer__description">{description}</BaseDrawer.Description>}
              {children}
            </BaseDrawer.Content>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
