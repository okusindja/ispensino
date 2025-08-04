import { FC } from 'react';

import { SVGProps } from './svg.types';

const Bookmark: FC<SVGProps> = ({ maxWidth, maxHeight, ...props }) => (
  <svg
    style={{ maxWidth, maxHeight }}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M20.5 16.929V10C20.5 6.229 20.5 4.343 19.328 3.172C18.156 2.001 16.271 2 12.5 2H11.5C7.729 2 5.843 2 4.672 3.172C3.501 4.344 3.5 6.229 3.5 10V19.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 3V6.69C8 7.43 8 7.8 8.238 7.944C8.24733 7.95067 8.258 7.95633 8.27 7.961C8.518 8.087 8.841 7.897 9.489 7.516C9.973 7.232 10.214 7.089 10.481 7.084H10.518C10.786 7.089 11.028 7.232 11.511 7.516C12.159 7.897 12.482 8.087 12.731 7.961L12.761 7.944C13 7.8 13 7.43 13 6.69V3M20.5 17H6C5.33696 17 4.70107 17.2634 4.23223 17.7322C3.76339 18.2011 3.5 18.837 3.5 19.5C3.5 20.163 3.76339 20.7989 4.23223 21.2678C4.70107 21.7366 5.33696 22 6 22H20.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.5 17C19.837 17 19.2011 17.2634 18.7322 17.7322C18.2634 18.2011 18 18.837 18 19.5C18 20.163 18.2634 20.7989 18.7322 21.2678C19.2011 21.7366 19.837 22 20.5 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Bookmark;
