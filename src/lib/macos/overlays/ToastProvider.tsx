import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import { cx } from '../../common';


export type ToastProviderProps = {
  children?: React.ReactNode;
  /** Auto-dismiss time in ms (default 5000; 0 keeps toasts until closed). */
  timeout?: number;
  /** Maximum number of toasts shown at once. */
  limit?: number;
  className?: string;
};

function ToastList({ className }: { className?: string }) {
  const { toasts } = BaseToast.useToastManager();
  return (
    <>
      {toasts.map((toast) => (
        <BaseToast.Root key={toast.id} toast={toast} className={cx('rd-mac rd-mac-toast', className)}>
          <BaseToast.Content className="rd-mac-toast__content">
            <BaseToast.Title className="rd-mac-toast__title" />
            <BaseToast.Description className="rd-mac-toast__description" />
            <BaseToast.Close className="rd-mac-toast__close" aria-label="Dismiss">×</BaseToast.Close>
          </BaseToast.Content>
        </BaseToast.Root>
      ))}
    </>
  );
}

/** Wrap your app once; call useToast().add({ title, description }) anywhere below it. */
export function ToastProvider({ children, timeout, limit, className }: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport className="rd-mac-toast__viewport" >
          <ToastList className={className} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}
