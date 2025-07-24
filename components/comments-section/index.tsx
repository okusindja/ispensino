/* eslint-disable @typescript-eslint/no-explicit-any */
import { Div, Textarea } from '@stylin.js/elements';
import { FC, useState } from 'react';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';

import { fetcherWithCredentials } from '@/constants/swr';
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

  const handleSubmit = async () => {
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    setError(null);

    // Declare tempId outside the try block so it's accessible in the catch block
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

      mutate([optimisticComment, ...(comments || [])], false);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error posting comment');
      addToast({
        title: 'Erro ao adicionar comentário',
        description: error || 'Ocorreu um erro ao adicionar seu comentário.',
        type: 'error',
      });
      // Revert optimistic comment
      mutate(comments?.filter((c: any) => c.tempId !== tempId) || [], false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    // Optimistic deletion
    mutate(comments?.filter((c: any) => c.id !== commentId) || [], false);
    addToast({
      title: 'Comentário excluído',
      description: 'Seu comentário foi excluído com sucesso.',
      type: 'success',
    });
  };

  return (
    <Div mt="XL" width="100%" gridColumn="1 / -1">
      <Typography variant="headline" size="small" color="text" mb="M">
        Comentários
      </Typography>

      {user ? (
        <Div mb="L">
          <Textarea
            value={commentContent}
            onChange={(e: any) => setCommentContent(e.target.value)}
            placeholder="Adicione um comentário..."
            p="M"
            width="100%"
            minHeight="100px"
            border="1px solid"
            borderColor="outline"
            borderRadius="M"
            mb="S"
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

      {comments?.length === 0 ? (
        <Div p="M" bg="surface_dark" borderRadius="M" textAlign="center">
          <Typography variant="body" size="small" color="text">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </Typography>
        </Div>
      ) : (
        comments?.map((comment) => (
          <Div key={comment.id} mb="L">
            <CommentItem
              comment={comment}
              lessonId={lessonId}
              onReply={() => mutate()}
              onDelete={handleDeleteComment}
            />

            {/* Render replies */}
            {comment.replies?.length > 0 && (
              <Div ml={['M', 'L', 'XL']} mt="M">
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
