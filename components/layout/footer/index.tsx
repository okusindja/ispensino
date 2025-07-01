import { Div, Footer as StylinFooter, Li, Ul } from '@stylin.js/elements';
import Link from 'next/link';

import { Routes, RoutesEnum } from '@/constants';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

const Footer = () => {
  return (
    <>
      <StylinFooter py="3XL" mt="3XL" color="white" bg="surface_x_dark">
        <Box variant="container">
          <Div
            gridColumn="1/-1"
            width="100%"
            display="flex"
            flexWrap="wrap"
            gap="4XL"
          >
            <Div>
              <Typography variant="fancy" size="medium" mb="L" fontWeight="400">
                Conteúdo informativo
              </Typography>
              <Ul display="flex" flexDirection="column" gap="M">
                {Object.values(RoutesEnum)
                  .slice(0, 8)
                  .map((routeKey) => (
                    <Li key={routeKey} textTransform="capitalize">
                      <Link href={Routes[routeKey]}>
                        <Typography variant="body" size="extraSmall">
                          {routeKey}
                        </Typography>
                      </Link>
                    </Li>
                  ))}
              </Ul>
            </Div>
            <Div>
              <Typography variant="fancy" size="medium" mb="L" fontWeight="400">
                Navegação
              </Typography>
              <Ul display="flex" flexDirection="column" gap="M">
                {Object.values(RoutesEnum)
                  .slice(8, -3)
                  .map((routeKey) => (
                    <Li key={routeKey} textTransform="capitalize">
                      <Link href={Routes[routeKey]}>
                        <Typography variant="body" size="extraSmall">
                          {routeKey}
                        </Typography>
                      </Link>
                    </Li>
                  ))}
              </Ul>
            </Div>
            <Div>
              <Typography variant="fancy" size="medium" mb="L" fontWeight="400">
                Institucional
              </Typography>
              <Ul display="flex" flexDirection="column" gap="M">
                {Object.values(RoutesEnum)
                  .slice(-3, Object.values(RoutesEnum).length)
                  .map((routeKey) => (
                    <Li key={routeKey} textTransform="capitalize">
                      <Link href={Routes[routeKey]}>
                        <Typography variant="body" size="extraSmall">
                          {routeKey}
                        </Typography>
                      </Link>
                    </Li>
                  ))}
              </Ul>
            </Div>
          </Div>
        </Box>
      </StylinFooter>
      <Div bg="white">
        <Box variant="container">
          <Div
            display="flex"
            gridColumn="1/-1"
            justifyContent="space-between"
            alignItems="center"
            py="M"
          >
            <Typography size="medium" variant="fancy">
              © {new Date().getFullYear()} - Todos os direitos reservados
            </Typography>
          </Div>
        </Box>
      </Div>
    </>
  );
};

export default Footer;
