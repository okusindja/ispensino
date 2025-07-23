import { FC } from 'react';

import { SVGProps } from './svg.types';

const Done: FC<SVGProps> = ({ maxWidth, maxHeight, ...props }) => (
  <svg
    style={{ maxWidth, maxHeight }}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M9.55001 18L3.85001 12.3L5.27501 10.875L9.55001 15.15L18.725 5.97501L20.15 7.40001L9.55001 18Z"
      fill="currentColor"
    />
  </svg>
);

export default Done;
