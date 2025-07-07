import { Div } from '@stylin.js/elements';

import { Layout, LogoutButton, ThemeSwitcher } from '@/components';

const Profile = () => {
  return (
    <Layout>
      <Div display="grid" gap="L" mt="3XL">
        <ThemeSwitcher />
        <LogoutButton />
      </Div>
    </Layout>
  );
};

export default Profile;
