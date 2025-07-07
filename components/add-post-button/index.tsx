import { Button } from '@/elements';

import { PlusSVG } from '../svg';

const AddPostButton = () => {
  return (
    <Button
      variant="primary"
      size="large"
      isIcon
      position="fixed"
      bottom="5rem"
      right="1rem"
      zIndex="99999"
    >
      <PlusSVG maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />
    </Button>
  );
};

export default AddPostButton;
