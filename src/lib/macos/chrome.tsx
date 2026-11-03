import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { cx, splitLayout, type LayoutProps } from '../common';

/* ---------- TitleBar ---------- */
export interface TitleBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  controls?: boolean;
  isFullscreen?: boolean;
  inset?: boolean;
  transparent?: boolean;
  onCloseClick?: () => void;
  onMinimizeClick?: () => void;
  onMaximizeClick?: () => void;
  onResizeClick?: () => void;
}
export function TitleBar({
  title, controls, isFullscreen, inset, transparent, className, children,
  onCloseClick, onMinimizeClick, onMaximizeClick, onResizeClick, ...rest
}: TitleBarProps) {
  return (
    <div
      className={cx('rd-mac rd-mac-titlebar', inset && 'rd-mac-titlebar--inset', transparent && 'rd-mac-titlebar--transparent', className)}
      data-fullscreen={isFullscreen ? '' : undefined}
      {...rest}
    >
      <div className="rd-mac-titlebar__row">
        {controls && (
          <div className="rd-mac-titlebar__controls">
            <BaseButton aria-label="Close" className="rd-mac-light rd-mac-light--close" onClick={onCloseClick} />
            <BaseButton aria-label="Minimize" className="rd-mac-light rd-mac-light--min" onClick={onMinimizeClick} />
            <BaseButton
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
              className="rd-mac-light rd-mac-light--max"
              onClick={isFullscreen ? onResizeClick : onMaximizeClick ?? onResizeClick}
            />
          </div>
        )}
        {title != null && <div className="rd-mac-titlebar__title">{title}</div>}
      </div>
      {children != null && <div className="rd-mac-titlebar__extra">{children}</div>}
    </div>
  );
}

/* ---------- Toolbar / ToolbarNav ---------- */
export interface ToolbarProps extends LayoutProps, Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Root>, 'className' | 'hidden'> {
  className?: string;
}
export function Toolbar({ className, style, ...p }: ToolbarProps) {
  const [ls, rest] = splitLayout(p);
  return <BaseToolbar.Root className={cx('rd-mac rd-mac-toolbar', className)} style={{ ...ls, ...(style as React.CSSProperties) }} {...rest} />;
}

/** Must be rendered inside <Toolbar>. */
export function ToolbarNav({ className, ...rest }: Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Group>, 'className'> & { className?: string }) {
  return <BaseToolbar.Group className={cx('rd-mac-toolbarnav', className)} {...rest} />;
}
export interface ToolbarNavItemProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseToolbar.Button>, 'className' | 'title' | 'children'> {
  title?: React.ReactNode; icon?: React.ReactNode; selected?: boolean; onPress?: () => void; className?: string;
}
export function ToolbarNavItem({ title, icon, selected, onPress, className, onClick, ...rest }: ToolbarNavItemProps) {
  return (
    <BaseToolbar.Button
      className={cx('rd-mac-toolbarnav__item', className)}
      data-selected={selected ? '' : undefined}
      aria-pressed={!!selected}
      onClick={(e) => { onClick?.(e); onPress?.(); }}
      {...rest}
    >
      {icon && <span className="rd-mac-toolbarnav__icon">{icon}</span>}
      {title && <span>{title}</span>}
    </BaseToolbar.Button>
  );
}

/* ---------- Dialog (sheet-style alert) ---------- */
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
