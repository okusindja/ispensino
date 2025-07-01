import { Div, Header } from '@stylin.js/elements';
import Link from 'next/link';
import { useState } from 'react';

import { BarsSVG, LogoSVG, SearchSVG, UserSVG } from '@/components/svg';
import { Routes, RoutesEnum } from '@/constants';
import { Box, Button } from '@/elements';

import MobileNav from './mobile-nav';

const Mobile = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    document.getElementsByTagName('body')[0].style.overflow = openMenu
      ? 'auto'
      : 'hidden';
    document.getElementsByTagName('html')[0].style.overflow = openMenu
      ? 'auto'
      : 'hidden';
  };

  return (
    <Header background="primary">
      <Box variant="container">
        <Div gridColumn="1/-1" width="100%">
          <Div
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Link href={Routes[RoutesEnum.Home]}>
              <LogoSVG width="100%" maxWidth="2rem" maxHeight="2rem" />
            </Link>
            <Div display="flex" gap="M" alignItems="center">
              <Button variant="neutral" size="medium" isIcon>
                <UserSVG width="100%" maxWidth="1.5rem" maxHeight="1.5rem" />
              </Button>
              <Div
                border=".5px solid"
                borderColor="outline"
                height="1.5rem"
                width=".5px"
              />
              <Button variant="neutral" size="medium" isIcon>
                <SearchSVG width="100%" maxWidth="1.5rem" maxHeight="1.5rem" />
              </Button>
              <Div
                border=".5px solid"
                borderColor="outline"
                height="1.5rem"
                width=".5px"
              />
              <Button
                variant="neutral"
                onClick={handleOpenMenu}
                size="medium"
                isIcon
              >
                <BarsSVG width="100%" maxWidth="1.5rem" maxHeight="1.5rem" />
              </Button>
            </Div>
          </Div>
        </Div>
      </Box>
      {openMenu && <MobileNav />}
    </Header>
  );
};

export default Mobile;
