import React, { FC } from 'react';
import { DialogMessageProps } from './dialog-message.types';

const SuccessMessage: FC<DialogMessageProps> = ({ message }) => {
  return <div>Success: {message}</div>;
};

export default SuccessMessage;
