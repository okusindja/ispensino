import { Div, Li, Nav, Ul } from '@stylin.js/elements';
import Link from 'next/link';

import { Routes, RoutesEnum } from '@/constants';
import { Typography } from '@/elements/typography';

const SecondaryHeader = () => {
  return (
    <Div display="flex" alignItems="center" gap="XS" mt="-1rem">
      <Nav
        ml="auto"
        pl="2XL"
        width="80%"
        height="3rem"
        display="flex"
        position="relative"
        alignItems="center"
        backgroundSize="contain"
        backgroundRepeat="no-repeat"
        backgroundImage="url('/secondary-header.svg')"
      >
        <Ul display="flex" color=" white" ml="3XL" gap="XL">
          {Object.values(RoutesEnum)
            .slice(8, -3)
            .map((routeKey) => (
              <Li key={routeKey} textTransform="capitalize" fontSize="XS">
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

export default SecondaryHeader;
