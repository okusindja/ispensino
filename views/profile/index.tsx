import { Div } from '@stylin.js/elements';

import { Layout, LogoutButton, ThemeSwitcher } from '@/components';
import { useAuth } from '@/contexts';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

const Profile = () => {
  const { user } = useAuth();
  return (
    <Layout>
      <Box variant="container">
        <Div display="grid" gridColumn="1 / -1" width="100%" gap="L" mt="3XL">
          <ThemeSwitcher />
          <Typography variant="fancy" size="medium" color="primary">
            {user?.name || 'User Profile'}
          </Typography>
          <Typography variant="fancy" size="medium" color="primary">
            {user?.email}
          </Typography>
          <LogoutButton />
        </Div>
      </Box>
    </Layout>
  );
};

export default Profile;
