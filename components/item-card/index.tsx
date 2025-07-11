import { Div } from '@stylin.js/elements';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { Typography } from '@/elements/typography';

import { TagSVG } from '../svg';
import { ItemCardProps } from './item-card.types';

const ItemCard: FC<ItemCardProps> = ({ title, to }) => {
  return (
    <Div
      p="M"
      width="100%"
      borderRadius="M"
      overflow="hidden"
      backgroundColor="surface"
      boxShadow="5px 5px 10px rgba(0, 0, 0, 0.03)"
      gridColumn={['span 2', 'span 2', 'span 6', 'span 6']}
    >
      <Link href={to} title={title}>
        <Div
          width="100%"
          borderRadius="S"
          overflow="hidden"
          position="relative"
          height="7rem"
        >
          <Image
            fill
            sizes="100%"
            quality={100}
            alt="Placeholder"
            style={{ objectFit: 'cover' }}
            src="https://picsum.photos/200/300"
          />
        </Div>
        <Div
          p="M"
          pb="0"
          gap="S"
          width="100%"
          display="flex"
          flexDirection="column"
          backgroundColor="surface"
        >
          <Div display="flex" alignItems="center" gap="S" color="text">
            <TagSVG maxWidth=".875rem" maxHeight="14px" width="100%" />
            <Typography variant="fancy" size="small" color="text">
              12,000.00 AOA
            </Typography>
          </Div>
          <Typography variant="fancy" size="large" color="text">
            Title
          </Typography>
          <Typography variant="body" size="extraSmall" color="text">
            13 Aulas
          </Typography>
        </Div>
      </Link>
    </Div>
  );
};

export default ItemCard;
