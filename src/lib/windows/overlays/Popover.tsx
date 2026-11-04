import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type PopoverProps = {
  /** The element that opens the popover. */
  trigger: React.ReactElement;
  title?: React.ReactNode;
  children?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  className?: string;
} & Themed;

export function Popover({ theme, color, trigger, title, children, side, align, open, defaultOpen, onOpenChange, modal, className }: PopoverProps) {
  return (
    <BasePopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner className="rd-win-positioner" side={side} align={align} sideOffset={8}>
          <BasePopover.Popup className={cx('rd-win rd-win-popup rd-win-popover', className)} {...themed(theme, color)}>
            {title != null && <BasePopover.Title className="rd-win-popover__title">{title}</BasePopover.Title>}
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
