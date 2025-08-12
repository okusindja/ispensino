import { useCallback, useEffect } from 'react';
import { v4 } from 'uuid';

import { useAuth } from '@/contexts';
import { PostProps } from '@/interface/types';
import { mutateWithAuth, useAuthenticatedSWR } from '@/lib/swr';

const CACHE_DURATION = 30000;

export const usePosts = () => {
  const { user } = useAuth();
  const {
    data: posts = [],
    error,
    isLoading,
    mutate,
  } = useAuthenticatedSWR<PostProps[]>('/api/posts');

  const refreshPosts = useCallback(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshPosts();
      }
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [refreshPosts]);

  const likePost = async (postId: string) => {
    try {
      mutate(
        (currentPosts) =>
          currentPosts?.map((post) => {
            if (post.id === postId) {
              const alreadyLiked = post.likes.some(
                (like) => like.userId === user?.id
              );
              return {
                ...post,
                likes: alreadyLiked
                  ? post.likes.filter((like) => like.userId !== user?.id)
                  : [
                      ...post.likes,
                      {
                        id: v4(),
                        createdAt: new Date(),
                        userId: user?.id ?? '',
                        postId: post.id,
                        commentId: null,
                      },
                    ],
              };
            }
            return post;
          }),
        false
      );

      await mutateWithAuth(`/api/posts/${postId}/like`, {}, 'POST');

      mutate();
    } catch (error) {
      console.error('Error liking post:', error);
      mutate();
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      mutate(
        (currentPosts) =>
          currentPosts?.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [
                  {
                    id: v4(),
                    content,
                    createdAt: new Date().toISOString(),
                    author: {
                      id: user?.id ?? '',
                      name: user?.name ?? '',
                      username: user?.username ?? '',
                    },
                  },
                  ...post.comments,
                ],
              };
            }
            return post;
          }),
        false
      );

      await mutateWithAuth(
        `/api/posts/${postId}/comments`,
        { content },
        'POST'
      );

      mutate();
    } catch (error) {
      console.error('Error adding comment:', error);
      mutate();
    }
  };

  return {
    posts,
    isLoading,
    error,
    refreshPosts,
    likePost,
    addComment,
  };
};
