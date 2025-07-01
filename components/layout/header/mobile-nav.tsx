import { Div, Li, Ul } from '@stylin.js/elements';
import Link from 'next/link';

import { Routes, RoutesEnum } from '@/constants';
import { Typography } from '@/elements/typography';

const MobileNav = () => {
  return (
    <Div
      width="100%"
      height="100vh"
      position="fixed"
      zIndex="100"
      display="flex"
    >
      <Div bg="surface_dark" flex="1">
        <Ul>
          {Object.values(RoutesEnum)
            .slice(0, 8)
            .map((routeKey) => (
              <Li
                key={routeKey}
                textTransform="capitalize"
                borderTop="1px solid"
                borderColor="outlineVariant"
                p="XL"
              >
                <Link href={Routes[routeKey]}>
                  <Typography variant="fancy" size="small" color="white">
                    {routeKey}
                  </Typography>
                </Link>
              </Li>
            ))}
        </Ul>
      </Div>
      <Div bg="white" flex="1">
        <Ul>
          {Object.values(RoutesEnum)
            .slice(8, -3)
            .map((routeKey) => (
              <Li
                key={routeKey}
                textTransform="capitalize"
                borderTop="1px solid"
                borderColor="outline"
                p="XL"
              >
                <Link href={Routes[routeKey]}>
                  <Typography variant="fancy" size="small" color="primary">
                    {routeKey}
                  </Typography>
                </Link>
              </Li>
            ))}
        </Ul>
      </Div>
    </Div>
  );
};

export default MobileNav;
