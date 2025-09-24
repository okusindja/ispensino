import { Div, useTheme } from '@stylin.js/elements';

import { Layout, LogoutButton, OptionItem, ThemeSwitcher } from '@/components';
import { useAuth } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { DesignSystemTheme } from '@/design-system';
import Image from 'next/image';
import {
  ArrowLeftSVG,
  LockSVG,
  MapSVG,
  PenSVG,
  SettingsSVG,
  UserSVG,
} from '@/components/svg';
import { useRouter } from 'next/router';

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  return (
    <Layout>
      <Box
        variant="container"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundImage="linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/profile-header.png')"
      >
        <Div
          width="100%"
          display="flex"
          gridColumn="1/-1"
          position="relative"
          alignItems="flex-end"
          justifyContent="space-between"
          height={['150px', '200px', '250px', '300px']}
        >
          <Div>
            <Button
              isIcon
              size="small"
              variant="neutral"
              onClick={() => router.back()}
            >
              <ArrowLeftSVG width="100%" maxWidth="5rem" maxHeight="5rem" />
            </Button>
            <Div
              width="6.5rem"
              height="6.5rem"
              overflow="hidden"
              background="white"
              position="relative"
              borderRadius="full"
              transform="translateY(3rem)"
              boxShadow="0 5px 17px 5px rgba(0, 0, 0, 0.1)"
            >
              <Image
                layout="fill"
                objectFit="cover"
                alt={user?.name || 'User Profile'}
                src={user?.photoURL || '/ronaldo.png'}
              />
            </Div>
          </Div>
          <Div color="white" display="flex" alignItems="center" gap="L" p="M">
            <ThemeSwitcher />
            <LogoutButton />
          </Div>
        </Div>
      </Box>
      <Div mt="3XL">
        <Box variant="container">
          <Div display="grid" gridColumn="1 / -1" width="100%" gap="M">
            <Typography variant="title" size="medium" color="text">
              {user?.name || 'User Profile'}
            </Typography>
            <Typography variant="body" size="medium" color="text" mb="XL">
              {user?.email}
            </Typography>
            <Typography variant="body" size="medium" color="text" my="XL">
              Definições de conta
            </Typography>
            <OptionItem
              label="Ver perfil social"
              Icon={UserSVG}
              onClick={() => router.push(`/profile/social/${user?.id}`)}
            />
            <OptionItem label="Editar Perfil" Icon={PenSVG} />
            <OptionItem label="Alterar senha" Icon={LockSVG} />
            <Typography variant="body" size="medium" color="text" my="XL">
              Definições de Sistema
            </Typography>
            <OptionItem label="Mudar idioma" Icon={MapSVG} />
          </Div>
        </Box>
      </Div>
    </Layout>
  );
};

export default Profile;
