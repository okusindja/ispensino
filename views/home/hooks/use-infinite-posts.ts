import { Post } from '@prisma/client';
import useSWRInfinite from 'swr/infinite';
import { v4 } from 'uuid';

import { fetcherWithCredentials } from '@/constants/fetchers';
import { useAuth } from '@/contexts';
import { PostProps } from '@/interface/types';

const PAGE_SIZE = 10;

export const useInfinitePosts = () => {
  const { user } = useAuth();

  // Get key function for SWR's infinite loading
  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    // Reached the end of the data
    if (previousPageData && !previousPageData.length) return null;

    // Return the API endpoint with pagination parameters
    return `/api/posts?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
  };

  const {
    data,
    error,
    size,
    setSize,
    // isValidating,
    mutate,
  } = useSWRInfinite<PostProps[]>(getKey, fetcherWithCredentials, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // Derived states
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  const posts = data ? data.flat() : [];

  // Function to load more posts
  const loadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  const refreshPosts = async () => {
    await mutate();
  };

  const likePost = async (postId: string) => {
    try {
      mutate((currentData) => {
        if (!currentData) return currentData;

        return currentData.map((page) =>
          page.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  isLiked: !post.isLiked,
                  likes: post.isLiked
                    ? post.likes.filter((like) => like.userId !== user?.id)
                    : [
                        ...post.likes,
                        {
                          ...(post.likes[0] || {
                            userId: '',
                            postId: post.id,
                          }),
                          userId: user?.id ?? '',
                        },
                      ],
                }
              : post
          )
        );
      }, false);

      await fetcherWithCredentials(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      mutate();
    } catch (error) {
      console.error('Error liking post:', error);
      mutate();
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      mutate((currentData) => {
        if (!currentData) return currentData;

        return currentData.map((page) =>
          page.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    {
                      id: v4(),
                      content,
                      createdAt: new Date().toISOString(),
                      author: {
                        id: user?.id ?? '',
                        name: 'You',
                        username: 'you',
                        image: null,
                      },
                    },
                    ...post.comments,
                  ],
                }
              : post
          )
        );
      }, false);

      await fetcherWithCredentials(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({ content, parentId: postId, tempId: v4() }),
      });

      mutate();
    } catch (error) {
      console.error('Error adding comment:', error);
      mutate();
    }
  };

  return {
    posts,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    error,
    loadMore,
    refreshPosts,
    likePost,
    addComment,
    mutate,
  };
};
