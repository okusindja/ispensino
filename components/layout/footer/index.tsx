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
      pb="XL"
      py="2XS"
      mt="auto"
      bottom="0"
      width="100%"
      color="text"
      position="fixed"
      backgroundColor="surface"
      boxShadow="1px -5px 10px rgba(0, 0, 0, 0.06)"
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
            gap="3XL"
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {Object.values(RoutesEnum).map((routeKey) => (
              <Li key={routeKey} textTransform="capitalize">
                <Link href={Routes[routeKey]}>
                  <Div
                    gap="S"
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    justifyContent="center"
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
