import { Main } from '@stylin.js/elements';
import { FC, PropsWithChildren } from 'react';

import Footer from './footer';
import Header from './header';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <Main mb="3XL" mt="3rem">
        {children}
      </Main>
      <Footer />
    </>
  );
};

export default Layout;
