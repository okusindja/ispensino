import { Div } from '@stylin.js/elements';
import Link from 'next/link';
import { FC } from 'react';

import { Typography } from '@/elements/typography';

import { ListItemCardProps } from './list-item-card.types';

const ListItemCard: FC<ListItemCardProps> = ({
  title,
  description,
  footerLeft,
  footerRight,
  Icon,
  to,
}) => {
  return (
    <Link href={to || '#'} title={title}>
      <Div
        backgroundColor="surface"
        padding="L"
        borderRadius="M"
        display="flex"
        flexDirection="column"
        gap="S"
      >
        <Div
          display="flex"
          paddingBottom="M"
          alignItems="center"
          justifyContent="space-between"
          borderBottom={footerRight || footerLeft ? '1px solid' : 0}
          borderColor="outline"
        >
          <Div display="grid" gap="M">
            <Typography
              variant="body"
              size="large"
              fontWeight="600"
              color="text"
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="body"
                textWrap="wrap"
                lines={1}
                width="100%"
                size="small"
                color="text"
                mb="M"
              >
                {description}
              </Typography>
            )}
          </Div>
          <Div color="text">
            {Icon && <Icon maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />}
          </Div>
        </Div>
        <Div
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt="M"
        >
          {footerLeft && <Div>{footerLeft}</Div>}
          {footerRight && <Div>{footerRight}</Div>}
        </Div>
      </Div>
    </Link>
  );
};

export default ListItemCard;
