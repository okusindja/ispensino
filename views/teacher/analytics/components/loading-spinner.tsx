import { FC } from 'react';
import { Div } from '@stylin.js/elements';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
}) => {
  const sizeMap = {
    small: '1.5rem',
    medium: '2.5rem',
    large: '4rem',
  };

  return (
    <Div
      width={sizeMap[size]}
      height={sizeMap[size]}
      borderWidth="3px"
      borderStyle="solid"
      borderTopColor={color}
      borderRightColor="transparent"
      borderBottomColor="transparent"
      borderLeftColor="transparent"
      borderRadius="50%"
      animation="spin 1s linear infinite"
    />
  );
};

// Add to global styles or CSS:
// @keyframes spin {
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// }
