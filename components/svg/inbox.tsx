import { FC } from 'react';

import { SVGProps } from './svg.types';

const Inbox: FC<SVGProps> = ({ maxWidth, maxHeight, ...props }) => (
  <svg
    style={{ maxWidth, maxHeight }}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M2 15L4.5 3H19.5L22 15"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 15H7.455L8.3635 18H15.6365L16.5455 15H22V21.5H2V15Z"
      stroke="black"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 7H14.5M8 11H16"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Inbox;
