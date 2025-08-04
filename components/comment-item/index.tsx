/* eslint-disable @typescript-eslint/no-explicit-any */
import { Comment, User } from '@prisma/client';
import { Div, Textarea } from '@stylin.js/elements';
import Image from 'next/image';
import { FC, PropsWithChildren, useState } from 'react';
import { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';

import { HeartSVG, ReplySVG, TrashSVG } from '@/components/svg';
import { fetcherWithCredentials } from '@/constants/swr';
import { useAuth, useToast } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { formatRelativeDate } from '@/utils';

export interface CommentProps extends Comment {
  author: {
    id: string;
    name: string;
    firebaseId: string;
  };
  likes: {
    id: string;
    user: User;
  }[];
  replies: CommentProps[];
  _count: {
    likes: number;
    replies: number;
  };
  tempId?: string; // For optimistic updates
}

interface CommentItemProps {
  comment: CommentProps;
  lessonId: string;
  isReply?: boolean;
  onReply?: () => void;
  onDelete?: (id: string) => void;
}

const CommentItem: FC<PropsWithChildren<CommentItemProps>> = ({
  comment,
  lessonId,
  isReply = false,
  onReply,
  onDelete,
  children,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);

  const isOwner = user?.uid === comment.author.firebaseId;
  const userLiked = comment.likes.some(
    (like) => like.user.firebaseId === user?.uid
  );
  const likeCount = comment._count?.likes;
  const replyCount = comment._count?.replies;

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const tempId = `temp-${uuidv4()}`;

    try {
      // Optimistic reply
      const optimisticReply = {
        id: tempId,
        tempId,
        content: replyContent,
        createdAt: new Date(),
        author: {
          name: user!.displayName,
          firebaseId: user!.uid,
        },
        likes: [],
        _count: { likes: 0, replies: 0 },
        parentId: comment.id,
      };

      mutate(`/api/comments?lessonId=${lessonId}`, (data: any) => {
        return (
          data.map((c: any) =>
            c.id === comment.id
              ? {
                  ...c,
                  replies: [...(c.replies || []), optimisticReply],
                  _count: { ...c._count, replies: c._count.replies + 1 },
                }
              : c
          ),
          false
        );
      });

      // Actual API call
      await fetcherWithCredentials(`/api/comments?lessonId=${lessonId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          parentId: comment.id,
          tempId,
        }),
      });

      addToast({
        title: 'Resposta enviada!',
        type: 'success',
        description: 'Sua resposta foi publicada com sucesso.',
      });

      setReplyContent('');
      setIsReplying(false);
      mutate(`/api/comments?lessonId=${lessonId}`);
      if (onReply) onReply();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error posting reply');
      addToast({
        title: 'Erro ao adicionar resposta',
        description: error || 'Ocorreu um erro ao adicionar sua resposta.',
        type: 'error',
      });
      // Revert optimistic update
      mutate(`/api/comments?lessonId=${lessonId}`, (data: any) => {
        return (
          data.map((c: any) =>
            c.id === comment.id
              ? {
                  ...c,
                  replies: c.replies.filter((r: any) => r.tempId !== tempId),
                  _count: { ...c._count, replies: c._count.replies - 1 },
                }
              : c
          ),
          false
        );
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    setIsLiking(true);
    setLikeError(null);

    try {
      // Optimistic update
      const newLikeCount = userLiked ? likeCount - 1 : likeCount + 1;
      const newLikes = userLiked
        ? comment.likes.filter((like) => like.user.firebaseId !== user.uid)
        : [
            ...comment.likes,
            { id: `temp-${uuidv4()}`, user: { firebaseId: user.uid } },
          ];

      mutate(
        `/api/comments?lessonId=${lessonId}`,
        (data: any) => {
          return data.map((c: any) => {
            if (c.id === comment.id) {
              return {
                ...c,
                likes: newLikes,
                _count: { ...c._count, likes: newLikeCount },
              };
            }

            // Also update if it's a reply in parent comment
            if (c.replies?.some((r: any) => r.id === comment.id)) {
              return {
                ...c,
                replies: c.replies.map((r: any) =>
                  r.id === comment.id
                    ? {
                        ...r,
                        likes: newLikes,
                        _count: { ...r._count, likes: newLikeCount },
                      }
                    : r
                ),
              };
            }

            return c;
          });
        },
        false
      );

      // Actual API call
      await fetcherWithCredentials('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: comment.id,
        }),
      });

      mutate(`/api/comments?lessonId=${lessonId}`);
    } catch (err) {
      addToast({
        title: 'Erro ao curtir comentário',
        description: error || 'Ocorreu um erro ao curtir o comentário.',
        type: 'error',
      });
      setLikeError(err instanceof Error ? err.message : 'Error toggling like');

      // Revert optimistic update
      mutate(
        `/api/comments?lessonId=${lessonId}`,
        (data: any) => {
          return data.map((c: any) => {
            if (c.id === comment.id) {
              return {
                ...c,
                likes: comment.likes,
                _count: { ...c._count, likes: likeCount },
              };
            }

            if (c.replies?.some((r: any) => r.id === comment.id)) {
              return {
                ...c,
                replies: c.replies.map((r: any) =>
                  r.id === comment.id
                    ? {
                        ...r,
                        likes: comment.likes,
                        _count: { ...r._count, likes: likeCount },
                      }
                    : r
                ),
              };
            }

            return c;
          });
        },
        false
      );
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      // Optimistic deletion
      onDelete(comment.id);

      // Actual API call
      await fetcherWithCredentials(`/api/comments?lessonId=${lessonId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: comment.id,
        }),
      });

      addToast({
        title: 'Comentário excluído',
        description: 'Seu comentário foi excluído com sucesso.',
        type: 'success',
      });

      mutate(`/api/comments?lessonId=${lessonId}`);
    } catch (err) {
      addToast({
        title: 'Erro ao excluir comentário',
        description: error || 'Ocorreu um erro ao excluir seu comentário.',
        type: 'error',
      });
      setError(err instanceof Error ? err.message : 'Error deleting comment');
      // Revert will be handled by parent component
    }
  };

  return (
    <Div
      p="M"
      mb="M"
      border="1px solid"
      borderColor="outline"
      borderRadius="M"
      bg={isReply ? 'surface_dark' : 'surface'}
      opacity={comment.tempId ? 0.75 : 1}
      {...(!isReply && {
        borderLeft: '3px solid',
        borderLeftColor: 'primary',
      })}
    >
      <Div
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="S"
      >
        <Div display="flex" alignItems="center">
          <Image
            width={32}
            height={32}
            alt={comment.author.name}
            style={{ borderRadius: '100%', marginRight: '0.5rem' }}
            src={`https://ui-avatars.com/api/?name=${comment.author.name}&background=random`}
          />
          <Div display="flex" flexDirection="column" gap="XS">
            <Typography variant="fancy" size="medium">
              {comment.author.name}
            </Typography>
            <Typography variant="body" size="extraSmall" color="text">
              {formatRelativeDate(comment.createdAt)}
            </Typography>
          </Div>
        </Div>

        {isOwner && (
          <Button
            variant="neutral"
            size="small"
            isIcon
            color="text"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            <TrashSVG maxWidth="1rem" maxHeight="1rem" width="100%" />
          </Button>
        )}
      </Div>

      <Typography variant="body" size="small" mb="M" mt="L">
        {comment.content}
      </Typography>

      {!isReply && (
        <Div display="flex" alignItems="center">
          <Button
            variant="neutral"
            size="small"
            isIcon
            display="flex"
            alignItems="center"
            color={userLiked ? 'primary' : 'text'}
            onClick={handleLike}
            disabled={!user || isLiking}
          >
            <HeartSVG
              width="100%"
              strokeColor="currentColor"
              maxWidth="1rem"
              maxHeight="1rem"
            />
            <Typography variant="body" size="small" ml="XS">
              {likeCount}
            </Typography>
          </Button>

          {likeError && (
            <Typography variant="body" size="small" color="error" ml="S">
              {likeError}
            </Typography>
          )}

          <Button
            variant="secondary"
            size="small"
            display="flex"
            alignItems="center"
            ml="M"
            isIcon
            onClick={() => setIsReplying(!isReplying)}
            disabled={!user}
          >
            <ReplySVG width="100%" maxWidth="1rem" maxHeight="1rem" />
            <Typography variant="body" size="small" ml="XS">
              {replyCount}
            </Typography>
          </Button>
        </Div>
      )}

      {isReplying && (
        <Div mt="M">
          <Textarea
            value={replyContent}
            onChange={(e: any) => setReplyContent(e.target.value)}
            placeholder="Escreva sua resposta..."
            p="M"
            width="100%"
            minHeight="100px"
            border="1px solid"
            borderColor="outline"
            borderRadius="M"
            mb="S"
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="secondary"
              size="small"
              mr="S"
              onClick={() => setIsReplying(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleReply}
              disabled={isSubmitting || !replyContent.trim()}
            >
              {isSubmitting ? 'Enviando...' : 'Responder'}
            </Button>
          </Box>
          {children && <Div mt="M">{children}</Div>}
        </Div>
      )}
    </Div>
  );
};

export default CommentItem;
