import { Article, Div } from '@stylin.js/elements';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

import { NewDetailsProps } from '../news.types';
import { formatDate } from '../news.utils';

const NewDetailsView: FC<NewDetailsProps> = ({ newDetails, allNews }) => {
  const allNewsWithoutCurrent = allNews.filter(
    (n) => n.slug !== newDetails.slug
  );
  const relatedNews = allNews.filter(
    (n) => n.slug === newDetails.reference.slug
  );

  return (
    <Layout>
      <Box variant="container">
        <Div
          gridColumn={['1/-1', '1/-1', '1/-1', '1/10']}
          width="100%"
          color="text"
        >
          <Article mb="2XL">
            <Typography as="h2" variant="large" color="primary" size="medium">
              {newDetails.title.pt}
            </Typography>
            <Typography variant="fancy" size="medium">
              Por: {newDetails.author}
            </Typography>
            <Typography
              variant="fancy"
              size="medium"
            >{`${newDetails.location}, ${formatDate(newDetails.date, 'pt-BR', false)}`}</Typography>
            <Div width="100%" my="XL" height="530px" position="relative">
              <Image
                fill
                sizes="100%"
                quality={100}
                src={newDetails.image}
                alt={newDetails.title.pt}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </Div>
            <Typography variant="body" size="medium">
              {newDetails.content.pt}
            </Typography>
          </Article>
          <Div
            display="grid"
            mb="XL"
            gridTemplateColumns="repeat(3, minmax(250px, 1fr))"
            gap="XL"
          >
            <Typography as="h3" variant="large" color="primary" size="small">
              Notícias relacionadas
            </Typography>
            {relatedNews &&
              relatedNews.map((n) => (
                <Typography
                  key={n.slug}
                  as="h3"
                  mb="XL"
                  variant="large"
                  color="primary"
                  size="small"
                >
                  {n.title.pt}
                </Typography>
              ))}
          </Div>
          {relatedNews.length === 0 && (
            <Typography variant="body" color="primary" size="small">
              Nenhuma notícia relacionada com {newDetails.reference.name}
            </Typography>
          )}
        </Div>
        <Div
          gridColumn={['1 / -1', '1 / -1', '1 / -1', '10 / -1']}
          width="100%"
          pl={['unset', 'unset', 'unset', 'XL']}
        >
          <Typography
            as="h3"
            mb="XL"
            variant="large"
            color="primary"
            size="small"
          >
            Outras notícias
          </Typography>
          <Div
            gap="XL"
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
          >
            {allNewsWithoutCurrent.map((n) => (
              <Article
                key={n.slug}
                borderBottom="1px solid"
                borderColor="outline"
                pb="L"
              >
                <Link href={`/news/${n.slug}`}>
                  <Div
                    width="100%"
                    height="200px"
                    position="relative"
                    overflow="hidden"
                  >
                    <Image
                      fill
                      sizes="100%"
                      quality={100}
                      src={n.image}
                      alt={n.title.pt}
                      style={{ objectFit: 'cover' }}
                    />
                  </Div>
                  <Typography
                    variant="fancy"
                    pt="L"
                    lines={1}
                    color="textVariant"
                    size="small"
                  >
                    {`${n.location}, ${formatDate(n.date, 'pt-BR', false)}`}
                  </Typography>
                  <Typography
                    variant="fancy"
                    pt="L"
                    size="medium"
                    fontWeight="500"
                    lines={2}
                  >
                    {n.title.pt}
                  </Typography>
                  <Typography variant="fancy" pt="M" lines={3} size="small">
                    {n.description.pt}
                  </Typography>
                </Link>
              </Article>
            ))}
          </Div>
        </Div>
      </Box>
    </Layout>
  );
};

export default NewDetailsView;
