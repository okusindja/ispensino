import { Div, Form, Textarea, useTheme } from '@stylin.js/elements';
import { useState } from 'react';

import { fetcherWithCredentials } from '@/constants/fetchers';
import { DesignSystemTheme } from '@/design-system';
import { Button } from '@/elements';
import { Typography } from '@/elements/typography';

interface PostFormProps {
  onSuccess: () => void;
  onError?: (error: Error) => void;
}

const PostForm = ({ onSuccess, onError }: PostFormProps) => {
  const { colors } = useTheme() as DesignSystemTheme;
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (onError) {
    onError(new Error(error));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await fetcherWithCredentials('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content, tags: [], attachments: [] }),
      });
      onSuccess();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Div p="XL" borderRadius="M" backgroundColor="surface" width="100%">
      <Form onSubmit={handleSubmit}>
        <Textarea
          p="M"
          mb="M"
          width="100%"
          fontSize="M"
          value={content}
          borderRadius="S"
          minHeight="150px"
          border={`1px solid ${colors.outline}`}
          onChange={(e) => setContent(e.target.value)}
          placeholder="O que queres partilhar com a comunidade científica?"
        />

        {error && (
          <Typography variant="body" size="medium" color="error" mb="M">
            {error}
          </Typography>
        )}

        <Div display="flex" justifyContent="flex-end" gap="M">
          <Button
            variant="neutral"
            size="medium"
            onClick={() => onSuccess()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="medium"
            variant="primary"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </Div>
      </Form>
    </Div>
  );
};

export default PostForm;
