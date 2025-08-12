/* eslint-disable @typescript-eslint/no-explicit-any */
import { Div, Textarea } from '@stylin.js/elements';
import { FC, useState } from 'react';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

import { fetcherWithCredentials } from '@/constants/fetchers';
import { useAuth, useToast } from '@/contexts';
import { Box, Button } from '@/elements';
import { Typography } from '@/elements/typography';

import CommentItem, { CommentProps } from '../comment-item';

interface CommentsSectionProps {
  lessonId: string;
}

const CommentsSection: FC<CommentsSectionProps> = ({ lessonId }) => {
  const { user } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const { data: comments, mutate } = useSWR<CommentProps[]>(
    `/api/comments?lessonId=${lessonId}`,
    fetcherWithCredentials
  );

  const safeComments = Array.isArray(comments) ? comments : [];

  const handleSubmit = async () => {
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const tempId = `temp-${uuidv4()}`;

    try {
      // Optimistic comment
      const optimisticComment = {
        id: tempId,
        tempId,
        content: commentContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        lessonId,
        authorId: user?.id ?? '',
        postId: null,
        parentId: null,
        author: {
          id: user?.id || '',
          name: user!.name,
          firebaseId: user!.uid,
        },
        likes: [],
        _count: { likes: 0, replies: 0 },
        replies: [],
      };

      mutate([optimisticComment, ...safeComments], false);

      // Actual API call
      await fetcherWithCredentials(`/api/comments?lessonId=${lessonId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentContent,
          tempId,
        }),
      });

      addToast({
        title: 'Comentário enviado!',
        type: 'success',
        description: 'Seu comentário foi publicado com sucesso.',
      });

      setCommentContent('');
      mutate();
    } catch (err: any) {
      const errorMessage = err.message || 'Error posting comment';
      setError(errorMessage);
      addToast({
        title: 'Erro ao adicionar comentário',
        description: errorMessage,
        type: 'error',
      });
      // Revert optimistic comment
      mutate(
        safeComments.filter((c: any) => c.tempId !== tempId),
        false
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    // Optimistic deletion
    mutate(
      safeComments.filter((c: any) => c.id !== commentId),
      false
    );
    addToast({
      title: 'Comentário excluído',
      description: 'Seu comentário foi excluído com sucesso.',
      type: 'success',
    });
  };

  return (
    <Div mt="M" width="100%" gridColumn="1 / -1">
      {user ? (
        <Div mb="L">
          <Textarea
            p="M"
            mb="S"
            width="100%"
            color="text"
            borderRadius="M"
            border="1px solid"
            minHeight="6.25rem"
            borderColor="outline"
            value={commentContent}
            backgroundColor="surface"
            placeholder="Adicione um comentário..."
            onChange={(e: any) => setCommentContent(e.target.value)}
            nPlaceholder={{
              color: 'gray',
              fontSize: 'small',
            }}
          />

          {error && (
            <Typography variant="body" size="small" color="error" mb="S">
              {error}
            </Typography>
          )}

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="primary"
              size="small"
              onClick={handleSubmit}
              disabled={isSubmitting || !commentContent.trim()}
            >
              {isSubmitting ? 'Enviando...' : 'Comentar'}
            </Button>
          </Box>
        </Div>
      ) : (
        <Div mb="L" p="M" bg="surface_dark" borderRadius="M">
          <Typography variant="body" size="small" color="text">
            Faça login para comentar
          </Typography>
        </Div>
      )}

      {safeComments.length === 0 ? (
        <Div p="M" bg="surface_dark" borderRadius="M" textAlign="center">
          <Typography variant="body" size="small" color="text">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </Typography>
        </Div>
      ) : (
        safeComments.map((comment) => (
          <Div key={comment.id} mb="L">
            <CommentItem
              comment={comment}
              lessonId={lessonId}
              onReply={() => mutate()}
              onDelete={handleDeleteComment}
            />

            {comment.replies?.length > 0 && (
              <Div ml={['XL', 'L', 'XL', 'XL']} mt="M">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    lessonId={lessonId}
                    isReply
                    onDelete={handleDeleteComment}
                  />
                ))}
              </Div>
            )}
          </Div>
        ))
      )}
    </Div>
  );
};

export default CommentsSection;
