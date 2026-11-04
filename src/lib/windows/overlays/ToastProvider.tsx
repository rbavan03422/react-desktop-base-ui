import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { cx } from '../../common';
import { themed, type Themed } from '../shared';

export type ToastProviderProps = {
  children?: React.ReactNode;
  /** Auto-dismiss time in ms (default 5000; 0 keeps toasts until closed). */
  timeout?: number;
  /** Maximum number of toasts shown at once. */
  limit?: number;
  className?: string;
} & Themed;

function ToastList({ className }: { className?: string }) {
  const { toasts } = BaseToast.useToastManager();
  return (
    <>
      {toasts.map((toast) => (
        <BaseToast.Root key={toast.id} toast={toast} className={cx('rd-win rd-win-toast', className)}>
          <BaseToast.Content className="rd-win-toast__content">
            <BaseToast.Title className="rd-win-toast__title" />
            <BaseToast.Description className="rd-win-toast__description" />
            <BaseToast.Close className="rd-win-toast__close" aria-label="Dismiss">×</BaseToast.Close>
          </BaseToast.Content>
        </BaseToast.Root>
      ))}
    </>
  );
}

/** Wrap your app once; call useToast().add({ title, description }) anywhere below it. */
export function ToastProvider({ theme, color, children, timeout, limit, className }: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="rd-win-toast__viewport" {...themed(theme, color)}>
          <ToastList className={className} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
