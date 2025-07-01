import { Div, Li, Nav, Ul } from '@stylin.js/elements';
import Link from 'next/link';

import { LogoSVG } from '@/components/svg';
import { Routes, RoutesEnum } from '@/constants';
import { Typography } from '@/elements/typography';

const MainHeader = () => {
  return (
    <Div display="flex" alignItems="center" gap="XS">
      <Div mt="L">
        <Link href={Routes[RoutesEnum.Home]}>
          <LogoSVG width="100%" maxWidth="5rem" maxHeight="5rem" />
        </Link>
      </Div>
      <Nav
        display="flex"
        position="relative"
        alignItems="center"
        width="100%"
        height="3.8rem"
        backgroundImage="url('/main-header.svg')"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
      >
        <Div
          position="absolute"
          bg="primary"
          height="100%"
          width="80%"
          zIndex="0"
          right="0"
        />
        <Ul display="flex" color="white" ml="3XL" gap="XL" zIndex="1">
          {Object.values(RoutesEnum)
            .slice(0, 8)
            .map((routeKey) => (
              <Li key={routeKey} textTransform="capitalize">
                <Link href={Routes[routeKey]}>
                  <Typography variant="fancy" size="small">
                    {routeKey}
                  </Typography>
                </Link>
              </Li>
            ))}
        </Ul>
      </Nav>
    </Div>
  );
};

export default MainHeader;
