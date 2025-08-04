import { Div } from '@stylin.js/elements';
import Link from 'next/link';
import { FC } from 'react';

import { Typography } from '@/elements/typography';

import { ContentItemProps } from './content-item.types';

const ContentItem: FC<ContentItemProps> = ({
  to,
  title,
  description,
  Icon,
  footerLeft,
  footerRight,
}) => {
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
            <Icon maxHeight="1.5rem" maxWidth="1.5rem" width="100%" />
          </Div>
          <Typography variant="fancy" size="large" color="textInverted">
            {title}
          </Typography>
          <Typography variant="fancy" size="small" color="textInverted">
            {description}
          </Typography>
        </Div>
        <Div
          p="L"
          backgroundColor="surface"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {footerLeft}
          {footerRight}
        </Div>
      </Div>
    </Link>
  );
};

export default ContentItem;
