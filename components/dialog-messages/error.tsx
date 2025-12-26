import React, { FC } from 'react';
import { DialogMessageProps } from './dialog-message.types';

const ErrorMessage: FC<DialogMessageProps> = ({ message }) => {
  return <div>Error: {message}</div>;
};

export default ErrorMessage;
