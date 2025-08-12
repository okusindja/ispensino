import { FC } from 'react';

import { useDialog } from '@/contexts';
import { Button } from '@/elements';

import PostForm from '../post-form';
import { PlusSVG } from '../svg';
import { AddPostButtonProps } from './add-post-button.types';

const AddPostButton: FC<AddPostButtonProps> = ({ onPostCreated, onError }) => {
  const { openDialog, closeDialog } = useDialog();

  const handlePostCreated = () => {
    setTimeout(() => {
      closeDialog();
      if (onPostCreated) {
        onPostCreated();
      }
    }, 1000);
  };

  const handleError = (error: Error) => {
    if (onError) {
      onError(error);
    }
  };

  const handleOpen = () => {
    openDialog(
      <PostForm onSuccess={handlePostCreated} onError={handleError} />,
      {
        title: 'Create New Post',
        size: 'md',
        description: 'Share your thoughts with the community',
      }
    );
  };

  return (
    <>
      <Button
        isIcon
        right="1rem"
        size="large"
        bottom="6rem"
        zIndex="99999"
        position="fixed"
        variant="primary"
        onClick={handleOpen}
      >
        <PlusSVG maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />
      </Button>
    </>
  );
};

export default AddPostButton;
