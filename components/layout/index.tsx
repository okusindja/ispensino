import { Main } from '@stylin.js/elements';
import { FC, PropsWithChildren } from 'react';

import Footer from './footer';
import Header from './header';

const Layout: FC<PropsWithChildren<{ hasGoBack?: boolean }>> = ({
  hasGoBack = false,
  children,
}) => {
  return (
    <>
      <Header hasGoBack={hasGoBack} />
      <Main mb="5XL" mt="3rem">
        {children}
      </Main>
      <Footer />
    </>
  );
};

export default Layout;
