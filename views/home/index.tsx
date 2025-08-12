import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout, TextField } from '@/components';
import AddPostButton from '@/components/add-post-button';
import { SearchSVG, SpinnerSVG } from '@/components/svg';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

import PostItem from './components/post-item';
import { useInfinitePosts } from './hooks/use-infinite-posts';

const Home: FC = () => {
  const {
    posts,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    // error,
    // loadMore,
    likePost,
    addComment,
  } = useInfinitePosts();

  return (
    <Layout>
      <Box variant="container">
        <Div width="100%" position="relative" height="100%" gridColumn="1/-1">
          <TextField
            py="M"
            Prefix={
              <SearchSVG maxHeight="1.5rem" maxWidth="1.5rem" width="100%" />
            }
            placeholder="Procure um nome ou username"
          />
          <Div display="grid" mt="L">
            {posts.map((post) => (
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
              <Typography variant="body" size="small" textAlign="center" py="L">
                No more posts to load
              </Typography>
            )}
          </Div>
        </Div>
        <AddPostButton />
      </Box>
    </Layout>
  );
};

export default Home;
