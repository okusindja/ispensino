import * as Dialog from '@radix-ui/react-dialog';
import { Div } from '@stylin.js/elements';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Button } from '@/elements';
import { Typography } from '@/elements/typography';

interface DialogContextType {
  openDialog: (content: ReactNode, options?: DialogOptions) => void;
  closeDialog: () => void;
}

interface DialogOptions {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

const DialogContext = createContext<DialogContextType>({
  openDialog: () => {},
  closeDialog: () => {},
});

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode>(null);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({});

  const openDialog = useCallback(
    (content: ReactNode, options: DialogOptions = {}) => {
      setDialogContent(content);
      setDialogOptions(options);
      setIsOpen(true);
    },
    []
  );

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setDialogContent(null);
        setDialogOptions({});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <Div display="none" />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <Div
              position="fixed"
              inset="0"
              bg="rgba(0,0,0,0.5)"
              zIndex="1000"
              key="overlay"
              style={{
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </Dialog.Overlay>

          {isOpen && (
            <Dialog.Content asChild>
              <Div
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                backgroundColor="background"
                width={
                  {
                    sm: '90vw',
                    md: '500px',
                    lg: '700px',
                    xl: '900px',
                  }[dialogOptions.size || 'md']
                }
                maxWidth="90vw"
                maxHeight="90vh"
                bg="white"
                borderRadius="L"
                boxShadow="0px 4px 16px rgba(0,0,0,0.1)"
                zIndex="1001"
                p="XL"
                overflow="auto"
                key="content"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen
                    ? 'translate(-50%, -50%)'
                    : 'translate(-50%, -60%)',
                  transition: 'all 0.3s ease',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {dialogOptions.title && (
                  <Dialog.Title asChild>
                    <Typography variant="headline" size="medium" mb="M">
                      {dialogOptions.title}
                    </Typography>
                  </Dialog.Title>
                )}

                {dialogOptions.description && (
                  <Dialog.Description asChild>
                    <Typography
                      variant="body"
                      size="medium"
                      mb="L"
                      color="text"
                    >
                      {dialogOptions.description}
                    </Typography>
                  </Dialog.Description>
                )}

                <Div mb="XL">{dialogContent}</Div>

                {dialogOptions.showClose !== false && (
                  <Dialog.Close asChild>
                    <Button
                      variant="neutral"
                      size="small"
                      type="button"
                      position="absolute"
                      top="M"
                      right="M"
                      aria-label="Close dialog"
                      onClick={closeDialog}
                    >
                      <CloseIcon size={20} />
                    </Button>
                  </Dialog.Close>
                )}
              </Div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </DialogContext.Provider>
  );
};

const CloseIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
