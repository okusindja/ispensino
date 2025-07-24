import type { AppProps } from 'next/app';
import Head from 'next/head';

import { ThemeManager } from '@/components';
import { AuthProvider, DialogProvider } from '@/contexts';
import { ToastProvider } from '@/contexts/toast';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <ThemeManager>
        <ToastProvider>
          <DialogProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </DialogProvider>
        </ToastProvider>
      </ThemeManager>
    </>
  );
};

export default App;
