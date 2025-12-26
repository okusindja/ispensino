import { Div, Form, Input, useTheme } from '@stylin.js/elements';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import {
  HeartSVG,
  // HeartFilledSVG,
  MessageSVG,
  // MessageFilledSVG,
  OptionsHorizontalSVG,
  SendSVG,
  // SendSVG,
} from '@/components/svg';
import { useAuth } from '@/contexts';
import { DesignSystemTheme } from '@/design-system';
import { Button } from '@/elements';
import { Typography } from '@/elements/typography';
import { PostProps } from '@/interface/types';
import { formatRelativeDate } from '@/utils';
import { useRouter } from 'next/router';

interface PostItemProps {
  post: PostProps;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => Promise<void>;
}

const PostItem = ({ post, onLike, onComment }: PostItemProps) => {
  const router = useRouter();
  const { colors } = useTheme() as DesignSystemTheme;
  const { user: currentUser } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const comments = post.comments || [];
  const likes = post.likes || [];
  // const attachments = post.attachments || [];

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsCommenting(true);
    await onComment?.(post.id, commentContent);
    setCommentContent('');
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    setIsCommenting(false);
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      onLike?.(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  useEffect(() => {
    if (showComments) {
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [showComments, comments.length]);

  // const getTaggedUsers = (content: string) => {
  //   const userMentions = content.match(/@(\w+)/g) || [];
  //   return userMentions.map(mention => mention.substring(1));
  // };

  const renderContentWithTags = (content: string) => {
    const parts = content.split(/(@\w+|#\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        //const username = part.substring(1);
        return (
          <Typography
            key={i}
            as="span"
            variant="fancy"
            size="small"
            color="primary"
            style={{ display: 'inline' }}
          >
            {part}
          </Typography>
        );
      } else if (part.startsWith('#')) {
        return (
          <Typography
            key={i}
            as="span"
            variant="fancy"
            size="small"
            color="secondary"
            style={{ display: 'inline' }}
          >
            {part}
          </Typography>
        );
      }
      return part;
    });
  };

  return (
    <Div my="M" borderRadius="M" overflow="hidden" backgroundColor="surface">
      <Div
        p="L"
        pb="S"
        display="flex"
        alignItems="center"
        backgroundColor="surface"
      >
        <Div
          bg="white"
          width="3rem"
          height="3rem"
          minWidth="3rem"
          cursor="pointer"
          overflow="hidden"
          borderRadius="full"
          position="relative"
          border={`2px solid ${colors.primary}`}
        >
          <Image
            fill
            priority
            sizes="100%"
            quality={100}
            alt={post.author.name}
            style={{ objectFit: 'cover' }}
            src={
              post.author.image ||
              'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
            }
          />
        </Div>
        <Div
          ml="M"
          cursor="pointer"
          onClick={() => router.push(`/profile/social/${post.author.id}`)}
        >
          <Typography
            variant="fancy"
            size="medium"
            color="text"
            fontWeight="bold"
          >
            {post.author.name}
          </Typography>
          <Typography variant="fancy" size="small" color="text">
            @{post.author.username || 'user'} ·{' '}
            {formatRelativeDate(new Date(post.createdAt))}
          </Typography>
        </Div>
        <Button
          isIcon
          ml="auto"
          size="small"
          color="text"
          variant="neutral"
          onClick={() => console.log('Post options')}
        >
          <OptionsHorizontalSVG
            maxWidth="1.5rem"
            maxHeight="1.5rem"
            width="100%"
          />
        </Button>
      </Div>

      <Div p="L" pb="S" backgroundColor="surface">
        <Typography variant="fancy" size="medium" color="text" lineHeight="1.5">
          {renderContentWithTags(post.content)}
        </Typography>
      </Div>

      {post.attachments?.length > 0 && (
        <Div
          position="relative"
          width="100%"
          aspectRatio="1/1"
          backgroundColor="surface"
        >
          <Image
            fill
            priority
            sizes="100%"
            quality={90}
            alt="Post content"
            src={post.attachments[0].url}
            style={{ objectFit: 'cover' }}
          />
        </Div>
      )}

      <Div p="M" gap="L" display="flex" alignItems="center">
        <Button
          isIcon
          variant="neutral"
          color={post.isLiked ? 'primary' : 'transparent'}
          size="medium"
          onClick={handleLike}
          disabled={isLiking}
          display="flex"
          alignItems="center"
          gap="S"
        >
          {post.isLiked ? (
            <HeartSVG
              maxWidth="1.65rem"
              maxHeight="1.65rem"
              width="100%"
              strokeColor="transparent"
            />
          ) : (
            <HeartSVG
              maxWidth="1.65rem"
              maxHeight="1.65rem"
              width="100%"
              strokeColor={colors.text}
              fill="none"
            />
          )}
          {likes.length > 0 && (
            <Typography variant="fancy" size="small">
              {likes.length}
            </Typography>
          )}
        </Button>

        <Button
          isIcon
          variant={showComments ? 'primary' : 'neutral'}
          color="text"
          size="medium"
          onClick={() => setShowComments(!showComments)}
          display="flex"
          alignItems="center"
          gap="S"
        >
          <MessageSVG maxWidth="1.65rem" maxHeight="1.65rem" width="100%" />
          {post.comments.length > 0 && (
            <Typography variant="fancy" size="small">
              {post.comments.length}
            </Typography>
          )}
        </Button>
      </Div>

      {showComments && (
        <Div maxHeight="300px" overflowY="auto" backgroundColor="surface_light">
          <Div p="L">
            {post.comments.length === 0 ? (
              <Typography
                variant="fancy"
                size="small"
                color="text"
                textAlign="center"
              >
                No comments yet
              </Typography>
            ) : (
              post.comments.map((comment) => (
                <Div key={comment.id} mb="M" display="flex" gap="M">
                  <Div
                    position="relative"
                    width="2.5rem"
                    height="2.5rem"
                    minWidth="2.5rem"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Image
                      fill
                      sizes="100%"
                      quality={100}
                      alt={comment.author.name}
                      src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                      style={{ objectFit: 'cover' }}
                    />
                  </Div>
                  <Div flex="1">
                    <Typography variant="fancy" size="small" fontWeight="bold">
                      {comment.author.name}
                    </Typography>
                    <Typography variant="fancy" size="small">
                      {comment.content}
                    </Typography>
                    <Typography
                      variant="fancy"
                      size="extraSmall"
                      color="text"
                      mt="XS"
                    >
                      {formatRelativeDate(new Date(comment.createdAt))}
                    </Typography>
                  </Div>
                </Div>
              ))
            )}
            <div ref={commentsEndRef} />
          </Div>

          <Form
            p="M"
            gap="M"
            display="flex"
            alignItems="center"
            onSubmit={handleCommentSubmit}
            borderTop={`1px solid ${colors.outline}`}
          >
            <Div
              position="relative"
              width="2.5rem"
              height="2.5rem"
              minWidth="2.5rem"
              borderRadius="full"
              overflow="hidden"
            >
              <Image
                fill
                sizes="100%"
                quality={100}
                alt={currentUser?.name || 'You'}
                src={
                  currentUser?.image ||
                  'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
                style={{ objectFit: 'cover' }}
              />
            </Div>
            <Input
              px="M"
              py="L"
              flex="1"
              type="text"
              borderRadius="M"
              value={commentContent}
              placeholder="Write a comment..."
              border={`1px solid ${colors.outline}`}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <Button
              isIcon
              size="small"
              type="submit"
              display="flex"
              variant="neutral"
              alignItems="center"
              justifyContent="center"
              disabled={isCommenting || !commentContent.trim()}
            >
              <SendSVG maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />
            </Button>
          </Form>
        </Div>
      )}
    </Div>
  );
};

export default PostItem;
