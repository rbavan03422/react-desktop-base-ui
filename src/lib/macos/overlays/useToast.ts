import { Toast as BaseToast } from '@base-ui/react/toast';

/** Returns { toasts, add, close, update }. Must be used under <ToastProvider>. */
export const useToast = BaseToast.useToastManager;
