import type { AppProps } from 'next/app';
import Head from 'next/head';

import ThemeManager from '@/components/theme-manager';
import { AuthProvider } from '@/contexts';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
    </Head>
    <AuthProvider>
      <ThemeManager>
        <Component {...pageProps} />
      </ThemeManager>
    </AuthProvider>
  </>
);

export default App;
