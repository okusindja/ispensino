import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

import { ThemeManager } from '@/components';
import {
  AuthProvider,
  DialogProvider,
  NotificationProvider,
  SocketProvider,
} from '@/contexts';
import { ToastProvider } from '@/contexts/toast';
import { useEffect } from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    fetch('/api/socket');
  }, []);
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <ThemeManager>
        <SocketProvider>
          <ToastProvider>
            <DialogProvider>
              <AuthProvider>
                <NotificationProvider>
                  <Component {...pageProps} />
                  <Toaster position="top-right" />
                </NotificationProvider>
              </AuthProvider>
            </DialogProvider>
          </ToastProvider>
        </SocketProvider>
      </ThemeManager>
    </>
  );
};

export default App;
