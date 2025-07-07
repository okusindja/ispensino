import { Div, useTheme } from '@stylin.js/elements';
import Image from 'next/image';

import {
  BookmarkSVG,
  HeartSVG,
  MessageSVG,
  OptionsHorizontalSVG,
} from '@/components/svg';
import { DesignSystemTheme } from '@/design-system';
import { Button } from '@/elements';
import { Typography } from '@/elements/typography';

const PostItem = () => {
  const { colors } = useTheme() as DesignSystemTheme;
  return (
    <Div>
      <Div
        padding="L"
        width="100%"
        color="text"
        height="100%"
        display="flex"
        borderRadius="8px"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        backgroundColor="surface_light"
      >
        <Div gap="M" width="100%" display="flex" alignItems="center">
          <Div
            backgroundColor="primary"
            position="relative"
            width="2.5rem"
            height="2.5rem"
            minWidth="2.5rem"
            borderRadius="full"
            overflow="hidden"
          >
            <Image
              fill
              priority
              sizes="100%"
              quality={100}
              alt="Post Thumbnail"
              style={{ objectFit: 'cover' }}
              src="https://picsum.photos/200/303"
            />
          </Div>
          <Div>
            <Div display="flex" alignItems="center" gap="S">
              <Typography variant="fancy" size="medium">
                Post Author
              </Typography>
              <Typography variant="fancy" size="small">
                @author
              </Typography>
            </Div>
            <Typography variant="fancy" size="small">
              9 meses.
            </Typography>
          </Div>
          <Button isIcon ml="auto" size="small" variant="secondary">
            <OptionsHorizontalSVG
              maxWidth="1.5rem"
              maxHeight="1.5rem"
              width="100%"
            />
          </Button>
        </Div>
        <Div width="100%" mt="M">
          <Typography variant="fancy" size="small" color="textSecondary">
            This is a brief description of the post content. It gives an
            overview of what the post is about.
          </Typography>
        </Div>
        <Div width="100%" position="relative" height="300px" mt="M">
          <Image
            fill
            priority
            sizes="100%"
            quality={100}
            alt="Post Image"
            src="https://picsum.photos/200/300"
            style={{ borderRadius: '8px', objectFit: 'cover' }}
          />
        </Div>
        <Div
          display="flex"
          width="100%"
          mt="M"
          alignItems="center"
          justifyContent="flex-start"
          gap="L"
        >
          <Button
            variant="neutral"
            p="0"
            width="fit-content"
            size="small"
            color="primary"
            display="flex"
            alignItems="center"
            gap="S"
          >
            <HeartSVG
              maxWidth="1.4rem"
              maxHeight="1.4rem"
              width="100%"
              strokeColor={colors.text}
            />
            23K
          </Button>
          <Button
            variant="neutral"
            p="0"
            width="fit-content"
            size="small"
            color="text"
            display="flex"
            alignItems="center"
            gap="S"
          >
            <MessageSVG maxWidth="1.4rem" maxHeight="1.4rem" width="100%" />
            65
          </Button>
          <Button
            variant="neutral"
            p="0"
            width="fit-content"
            size="small"
            color="text"
            display="flex"
            alignItems="center"
            gap="S"
          >
            <BookmarkSVG maxWidth="1.4rem" maxHeight="1.4rem" width="100%" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
};

export default PostItem;
