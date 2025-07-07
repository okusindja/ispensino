import { FC } from 'react';

import { SVGProps } from './svg.types';

const Heart: FC<SVGProps & { strokeColor: string }> = ({
  maxWidth,
  maxHeight,
  strokeColor,
  ...props
}) => (
  <svg style={{ maxWidth, maxHeight }} viewBox="0 0 24 24" {...props}>
    <path
      d="M16.5 4C19.0289 4 21 5.96348 21 8.5C21 10.0562 20.3069 11.5515 18.8818 13.2949C17.4458 15.0517 15.3728 16.9364 12.7783 19.2891L12.7764 19.29L12 19.9971L11.2236 19.29L11.2217 19.2891C8.62719 16.9364 6.55418 15.0517 5.11816 13.2949C3.69311 11.5515 3 10.0562 3 8.5C3 5.96348 4.97109 4 7.5 4C8.9377 4 10.3342 4.67462 11.2412 5.73145L12 6.61523L12.7588 5.73145C13.6658 4.67462 15.0623 4 16.5 4Z"
      fill="currentColor"
      stroke={strokeColor}
      strokeWidth="2"
    />
  </svg>
);

export default Heart;
