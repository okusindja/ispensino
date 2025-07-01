import { SEO } from '@/components';
import { NextPageWithProps } from '@/interface/declaration';
import HomeView from '@/views/home';

const HomePage: NextPageWithProps = ({ pageTitle }) => (
  <>
    <SEO pageTitle={pageTitle} />
    <HomeView />
  </>
);

export default HomePage;
