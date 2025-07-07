import { Div, Footer as StylinFooter, Li, Ul } from '@stylin.js/elements';
import Link from 'next/link';

import { BookSVG, ContentSVG, HomeSVG, UserSVG } from '@/components/svg';
import { Routes, RoutesEnum } from '@/constants';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

const iconMapping = {
  [RoutesEnum.Home]: HomeSVG,
  [RoutesEnum.User]: UserSVG,
  [RoutesEnum.Library]: BookSVG,
  [RoutesEnum.Content]: ContentSVG,
};

const renderIcon = (routeKey: RoutesEnum) => {
  const IconComponent = iconMapping[routeKey] || HomeSVG;
  return <IconComponent maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />;
};

const Footer = () => {
  return (
    <StylinFooter
      position="fixed"
      py="2XS"
      pb="XL"
      width="100%"
      bottom="0"
      mt="auto"
      color="text"
      bg="surface"
    >
      <Box variant="container">
        <Div
          gap="4XL"
          width="100%"
          display="flex"
          flexWrap="wrap"
          gridColumn="1/-1"
        >
          <Ul
            width="100%"
            display="flex"
            gap="3XL"
            alignItems="center"
            justifyContent="center"
          >
            {Object.values(RoutesEnum).map((routeKey) => (
              <Li key={routeKey} textTransform="capitalize">
                <Link href={Routes[routeKey]}>
                  <Div
                    display="flex"
                    gap="S"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                  >
                    {renderIcon(routeKey)}
                    <Typography variant="body" size="extraSmall">
                      {routeKey}
                    </Typography>
                  </Div>
                </Link>
              </Li>
            ))}
          </Ul>
        </Div>
      </Box>
    </StylinFooter>
  );
};

export default Footer;
