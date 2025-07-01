import { GetStaticPaths, GetStaticProps } from 'next';
// import NewDetailsView from '@/views/news/details';
import dynamic from 'next/dynamic';

import { SEO } from '@/components';
import { NextPageWithNewsDetailsProps } from '@/interface/declaration';
import { NEWS } from '@/mocks/news';
import { NewsItem } from '@/views/news/news.types';

const NewDetailsView = dynamic(() => import('@/views/news/details'), {
  ssr: false,
  loading: () => <p>Carregando...</p>,
});

const NewDetailsPage: NextPageWithNewsDetailsProps = ({
  newDetails,
  allNews,
  pageTitle,
}) => (
  <>
    <SEO pageTitle={pageTitle} />
    <NewDetailsView allNews={allNews} newDetails={newDetails} />
  </>
);

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const paths = NEWS.map((n: NewsItem) => ({
      params: { slug: n.slug },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.slug) {
    return { notFound: true };
  }

  const newDetails = NEWS.find((n: NewsItem) => n.slug === params.slug);

  return {
    props: {
      pageTitle: newDetails?.title.pt,
      newDetails,
      allNews: NEWS,
    },
  };
};

export default NewDetailsPage;
