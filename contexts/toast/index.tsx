// components/toast/toast-context.tsx
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Div } from '@stylin.js/elements';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = uuidv4();
    setToasts((prev) => [{ ...toast, id }, ...prev]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastPrimitive.Provider>
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            asChild
            duration={5000}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
          >
            <Div
              p="M"
              mb="S"
              bg="surface"
              border="1px solid"
              borderColor="outline"
              borderRadius="M"
              boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
            >
              <ToastPrimitive.Title asChild>
                <Typography
                  variant="title"
                  size="small"
                  color={getTitleColor(toast.type)}
                >
                  {toast.title}
                </Typography>
              </ToastPrimitive.Title>

              {toast.description && (
                <ToastPrimitive.Description asChild>
                  <Typography variant="body" size="small" color="text" mt="XS">
                    {toast.description}
                  </Typography>
                </ToastPrimitive.Description>
              )}

              <ToastPrimitive.Close asChild>
                <Box
                  as="button"
                  position="absolute"
                  top="M"
                  right="M"
                  p="XS"
                  cursor="pointer"
                  aria-label="Close"
                >
                  <CloseIcon />
                </Box>
              </ToastPrimitive.Close>
            </Div>
          </ToastPrimitive.Root>
        ))}

        <ToastPrimitive.Viewport asChild>
          <Div
            position="fixed"
            bottom="0"
            right="0"
            p="L"
            width="100%"
            maxWidth="400px"
            zIndex="9999"
          />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};

const getTitleColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'info':
    default:
      return 'text';
  }
};

// Simple close icon component (replace with your icon)
const CloseIcon = () => (
  <Box
    width="16px"
    height="16px"
    position="relative"
    nBefore={{
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '0',
      width: '100%',
      height: '2px',
      bg: 'text',
      transform: 'rotate(45deg)',
    }}
    nAfter={{
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '0',
      width: '100%',
      height: '2px',
      bg: 'text',
      transform: 'rotate(-45deg)',
    }}
  />
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
