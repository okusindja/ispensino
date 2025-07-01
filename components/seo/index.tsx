import Head from 'next/head';
import { FC } from 'react';

const SEO: FC<{ pageTitle: string }> = ({ pageTitle }) => (
  <Head>
    <title>{pageTitle}</title>
    <link rel="icon" type="image/x-icon" href="/icon.svg" />
  </Head>
);

export default SEO;
