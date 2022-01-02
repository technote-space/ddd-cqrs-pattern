import type { ReactNode } from 'react';

export type ToastProps = {
  title?: ReactNode;
  description?: ReactNode;
  duration?: number | null;
  id?: string;
  placement?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-left' | 'bottom-right';
  status?: 'info' | 'warning' | 'success' | 'error';
};

export type ToastMethods = {
  show: (props: ToastProps) => void;
  close: (id: string) => void;
  closeAll: () => void;
};

export interface IToast {
  useToast(): ToastMethods;
}
