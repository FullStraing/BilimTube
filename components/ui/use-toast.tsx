'use client';

import * as React from 'react';
import type { ToastProps } from '@radix-ui/react-toast';

type ToastItem = ToastProps & {
  id: string;
  title?: string;
  description?: string;
};

type ToastState = {
  toasts: ToastItem[];
};

type ToastAction =
  | { type: 'ADD_TOAST'; toast: ToastItem }
  | { type: 'DISMISS_TOAST'; toastId?: string };

const ToastContext = React.createContext<{
  toasts: ToastItem[];
  toast: (toast: Omit<ToastItem, 'id'>) => void;
  dismiss: (toastId?: string) => void;
} | null>(null);

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [action.toast, ...state.toasts].slice(0, 5) };
    case 'DISMISS_TOAST':
      return {
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId)
      };
    default:
      return state;
  }
}

export function ToastStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const toast = React.useCallback((toastInput: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID();
    dispatch({ type: 'ADD_TOAST', toast: { id, ...toastInput } });
  }, []);

  const dismiss = React.useCallback(
    (toastId?: string) => {
      if (!toastId && state.toasts.length) {
        dispatch({ type: 'DISMISS_TOAST', toastId: state.toasts[0].id });
        return;
      }
      if (toastId) {
        dispatch({ type: 'DISMISS_TOAST', toastId });
      }
    },
    [state.toasts],
  );

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastStateProvider');
  }
  return ctx;
}
