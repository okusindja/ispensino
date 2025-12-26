import { Div } from '@stylin.js/elements';

import { Layout, LogoutButton, TextField, ThemeSwitcher } from '@/components';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import Image from 'next/image';
import {
  ArrowLeftSVG,
  FollowSVG,
  SearchSVG,
  SpinnerSVG,
} from '@/components/svg';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { SocialProfileProps } from './social.types';
import PostItem from '@/views/home/components/post-item';
import { useInfinitePosts } from '@/views/home/hooks/use-infinite-posts';
import useSWR from 'swr';
import { fetcherWithCredentials } from '@/constants/fetchers';
import { User } from '@prisma/client';
import { useAuth } from '@/contexts';
import { UserProps } from '@/interface/types';

const SocialProfile: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const loggedUser = useAuth();
  const { data, error } = useSWR<
    UserProps & { following: number; followers: number; bio: string }
  >(`/api/users/${id}`, fetcherWithCredentials);
  const user = data;
  const isLoggedUSer = user?.id === loggedUser.user?.id;
  const {
    posts,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    likePost,
    addComment,
  } = useInfinitePosts();
  return (
    <Layout>
      <Box
        variant="container"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundImage="linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/profile-header.png')"
      >
        <Div
          width="100%"
          display="flex"
          gridColumn="1/-1"
          position="relative"
          alignItems="flex-end"
          justifyContent="space-between"
          height={['150px', '200px', '250px', '300px']}
        >
          <Div>
            <Button
              isIcon
              size="small"
              variant="neutral"
              onClick={() => router.back()}
            >
              <ArrowLeftSVG width="100%" maxWidth="5rem" maxHeight="5rem" />
            </Button>
            <Div
              width="6.5rem"
              height="6.5rem"
              overflow="hidden"
              background="white"
              position="relative"
              borderRadius="full"
              transform="translateY(3rem)"
              boxShadow="0 5px 17px 5px rgba(0, 0, 0, 0.1)"
            >
              <Image
                layout="fill"
                objectFit="cover"
                alt={user?.name || 'User Profile'}
                src={
                  user?.image ||
                  'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
              />
            </Div>
          </Div>
          <Div color="white" display="flex" alignItems="center" gap="L" p="M">
            {!isLoggedUSer && (
              <Button
                variant="primary"
                display="flex"
                alignItems="center"
                gap="S"
                size="small"
                color="invertedText"
                onClick={() => {}}
              >
                <FollowSVG maxWidth="1.2rem" maxHeight="1.2rem" width="100%" />
                <Typography variant="body" size="small">
                  Seguir
                </Typography>
              </Button>
            )}
          </Div>
        </Div>
      </Box>
      <Div mt="3XL">
        <Box variant="container">
          <Div display="grid" gridColumn="1 / -1" width="100%" gap="M">
            <Typography variant="title" size="medium" color="text">
              {user?.name || 'User Profile'}
            </Typography>
            <Typography variant="body" size="medium" color="text" mb="XL">
              {user?.bio || 'Esta pessoa não escreveu nada sobre ela.'}
            </Typography>
            <Div display="flex" alignItems="center" gap="XL">
              <Typography variant="body" size="medium" color="text">
                {user?.followers || 0} seguidores
              </Typography>
              <Typography variant="body" size="medium" color="text">
                {user?.following || 0} seguindo
              </Typography>
            </Div>
            <Div
              width="100%"
              position="relative"
              height="100%"
              gridColumn="1/-1"
            >
              <Div display="grid" mt="L">
                {posts
                  .filter((post) => post.author.id === user?.id)
                  .map((post) => (
                    <PostItem
                      key={post.id}
                      post={post}
                      onLike={likePost}
                      onComment={addComment}
                    />
                  ))}
                {(isLoadingInitialData || isLoadingMore) && !isReachingEnd && (
                  <Div display="flex" justifyContent="center" py="XL">
                    <SpinnerSVG maxHeight="2rem" maxWidth="2rem" width="100%" />
                  </Div>
                )}
                {isReachingEnd && posts.length > 0 && (
                  <Typography
                    variant="body"
                    size="small"
                    textAlign="center"
                    py="L"
                    color="text"
                  >
                    No more posts to load
                  </Typography>
                )}
              </Div>
            </Div>
          </Div>
        </Box>
      </Div>
    </Layout>
  );
};

export default SocialProfile;
