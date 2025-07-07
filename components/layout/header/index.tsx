import { Div, Header as StylinHeader } from '@stylin.js/elements';
import Link from 'next/link';

import { LogoSVG } from '@/components/svg';
import { Routes, RoutesEnum } from '@/constants';
import { Box } from '@/elements';

const Header = () => {
  return (
    <>
      <StylinHeader
        zIndex="10"
        position="absolute"
        top="0"
        width="100%"
        backgroundColor="surface"
      >
        <Box variant="container">
          <Div
            gridColumn="1/-1"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Link href={Routes[RoutesEnum.Home]}>
              <LogoSVG width="100%" maxWidth="2.5rem" maxHeight="2.5rem" />
            </Link>
          </Div>
        </Box>
      </StylinHeader>
    </>
  );
};

export default Header;
