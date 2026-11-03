import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { cx } from '../../common';

export interface DialogProps {
  open?: boolean;
  hidden?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  message?: React.ReactNode;
  icon?: React.ReactNode;
  buttons?: React.ReactNode;
  container?: React.ComponentPropsWithoutRef<typeof BaseDialog.Portal>['container'];
  className?: string;
}

export function Dialog({ open, hidden, onOpenChange, title, message, icon, buttons, container, className }: DialogProps) {
  return (
    <BaseDialog.Root open={open ?? !hidden} onOpenChange={onOpenChange}>
      <BaseDialog.Portal container={container}>
        <BaseDialog.Backdrop className="rd-mac-dialog__backdrop" />
        <BaseDialog.Popup className={cx('rd-mac rd-mac-dialog', className)}>
          {icon && <div className="rd-mac-dialog__icon">{icon}</div>}
          <div className="rd-mac-dialog__body">
            {title != null && <BaseDialog.Title className="rd-mac-dialog__title">{title}</BaseDialog.Title>}
            {message != null && <BaseDialog.Description className="rd-mac-dialog__message">{message}</BaseDialog.Description>}
            {buttons && <div className="rd-mac-dialog__buttons">{buttons}</div>}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
