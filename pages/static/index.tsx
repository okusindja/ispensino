import { GetStaticProps } from 'next';

import { SEO } from '@/components';
import { NextPageWithNewsProps } from '@/interface/declaration';
import { NEWS } from '@/mocks/news';
import News from '@/views/news';

const NewsPage: NextPageWithNewsProps = ({ news, pageTitle }) => (
  <>
    <SEO pageTitle={pageTitle} />
    <News news={news} />
  </>
);

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      news: NEWS,
      pageTitle: 'Todas as notícias na Golapp',
    },
  };
};

export default NewsPage;
