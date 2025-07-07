import { Div } from '@stylin.js/elements';

import { Tabs } from '@/components';

import LoginView from '../login';
import SignupView from '../signup';

const Auth = () => {
  return (
    <Div height="100vh" mx="auto" maxWidth="36rem" backgroundColor="background">
      <Tabs
        px="XL"
        tabList={['Login', 'Criar Conta']}
        position="bottom"
        tabContent={[<LoginView key="login" />, <SignupView key="signup" />]}
      />
    </Div>
  );
};

export default Auth;
