import { NextPage } from 'next';

import { SEO } from '@/components';
import AboutUsView from '@/views/about-us';

const AboutUsPage: NextPage = () => (
  <>
    <SEO pageTitle="Sobre Nós" />
    <AboutUsView />
  </>
);

export default AboutUsPage;
