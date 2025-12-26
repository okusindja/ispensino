import { FC } from 'react';

import { SVGProps } from './svg.types';

const Send: FC<SVGProps> = ({ maxWidth, maxHeight, ...props }) => (
  <svg
    style={{ maxWidth, maxHeight }}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M0.75 21.75L23.25 12L0.75 2.25V9.75L15.75 12L0.75 14.25V21.75Z"
      fill="currentColor"
    />
  </svg>
);
export default Send;
