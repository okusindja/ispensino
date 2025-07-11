import { Div } from '@stylin.js/elements';
import Link from 'next/link';
import { FC } from 'react';

import { OptionsHorizontalSVG } from '@/components/svg';
import { Typography } from '@/elements/typography';

import { ContentItemProps } from './content-item.types';

const ContentItem: FC<ContentItemProps> = ({ to, title }) => {
  return (
    <Link href={to} title={title}>
      <Div
        boxShadow="5px 5px 10px rgba(0, 0, 0, 0.06)"
        borderRadius="M"
        overflow="hidden"
        width="100%"
      >
        <Div p="L" gap="XL" display="grid" backgroundColor="primary">
          <Div
            p="S"
            width="2rem"
            height="2rem"
            borderRadius="M"
            backgroundColor="onPrimary"
          >
            <OptionsHorizontalSVG
              maxHeight="1.5rem"
              maxWidth="1.5rem"
              width="100%"
            />
          </Div>
          <Typography variant="fancy" size="large" color="textInverted">
            Content Author
          </Typography>
          <Typography variant="fancy" size="small" color="textInverted">
            2 Cursos
          </Typography>
        </Div>
        <Div p="L" backgroundColor="surface">
          <Typography
            variant="fancy"
            textAlign="right"
            color="text"
            size="medium"
          >
            Content Title
          </Typography>
        </Div>
      </Div>
    </Link>
  );
};

export default ContentItem;
