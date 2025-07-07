import { Button } from '@/elements';

import { PlusSVG } from '../svg';

const AddPostButton = () => {
  return (
    <Button
      isIcon
      right="1rem"
      size="large"
      bottom="6rem"
      zIndex="99999"
      position="fixed"
      variant="primary"
    >
      <PlusSVG maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />
    </Button>
  );
};

export default AddPostButton;
