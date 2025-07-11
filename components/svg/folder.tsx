import { FC } from 'react';

import { SVGProps } from './svg.types';

const Folder: FC<SVGProps> = ({ maxWidth, maxHeight, ...props }) => (
  <svg
    style={{ maxWidth, maxHeight }}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M2 6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H9C9.26519 4.00006 9.51951 4.10545 9.707 4.293L11.414 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V6ZM8.586 6H4V18H20V8H11C10.7348 7.99994 10.4805 7.89455 10.293 7.707L8.586 6Z"
      fill="currentColor"
    />
  </svg>
);

export default Folder;
