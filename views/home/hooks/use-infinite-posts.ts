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
    data, // Array of page data
    error, // Error object
    size, // Current page size
    setSize, // Function to set page size
    // isValidating,  // Whether data is being validated
    mutate, // Mutation function for manual revalidation
  } = useSWRInfinite<PostProps[]>(getKey, fetcherWithCredentials, {
    revalidateFirstPage: false, // Don't revalidate first page on focus
    revalidateOnFocus: false, // Disable revalidation on window focus
    shouldRetryOnError: false, // Disable automatic retries on error
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

  // Function to refresh all posts
  const refreshPosts = async () => {
    await mutate();
  };

  // Function to like a post
  const likePost = async (postId: string) => {
    try {
      // Optimistic update
      mutate(
        (currentData) => {
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
        },
        false // Don't revalidate yet
      );

      // Perform the actual API call
      await fetcherWithCredentials(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      // Revalidate the data
      mutate();
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      mutate();
    }
  };

  // Function to add a comment
  const addComment = async (postId: string, content: string) => {
    try {
      // Optimistic update
      mutate(
        (currentData) => {
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
        },
        false // Don't revalidate yet
      );

      // Perform the actual API call
      await fetcherWithCredentials(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });

      // Revalidate the data
      mutate();
    } catch (error) {
      console.error('Error adding comment:', error);
      // Revert on error
      mutate();
    }
  };

  return {
    posts, // Flattened array of all loaded posts
    isLoadingInitialData, // Whether the initial data is loading
    isLoadingMore, // Whether more data is being loaded
    isReachingEnd, // Whether we've reached the end of available data
    error, // Error object if any error occurred
    loadMore, // Function to load more posts
    refreshPosts, // Function to refresh all posts
    likePost, // Function to like/unlike a post
    addComment, // Function to add a comment
    mutate, // SWR mutate function for manual updates
  };
};
