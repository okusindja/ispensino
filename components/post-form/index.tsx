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
    <Div
      p="L"
      borderRadius="M"
      backgroundColor="surface"
      maxWidth="600px"
      width="90vw"
    >
      <Typography variant="headline" size="medium" mb="L">
        Create New Post
      </Typography>

      <Form onSubmit={handleSubmit}>
        <Textarea
          width="100%"
          minHeight="150px"
          p="M"
          mb="M"
          borderRadius="S"
          border={`1px solid ${colors.outline}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
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
