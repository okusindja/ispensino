import { Div } from '@stylin.js/elements';
import { FC } from 'react';
import { OptionItemProps } from './option-item.types';
import { CaretRightSVG } from '../svg';

const OptionItem: FC<OptionItemProps> = ({ label, Icon, onClick }) => {
  return (
    <Div
      px="L"
      py="XL"
      color="text"
      width="100%"
      display="flex"
      cursor="pointer"
      borderRadius="M"
      onClick={onClick}
      alignItems="center"
      backgroundColor="surface"
      justifyContent="space-between"
    >
      <Div display="flex" alignItems="center" gap="M">
        {Icon && <Icon width="100%" maxWidth="1.5rem" maxHeight="1.5rem" />}
        {label}
      </Div>
      <Div opacity={0.3}>
        <CaretRightSVG width="100%" maxWidth="1.5rem" maxHeight="1.5rem" />
      </Div>
    </Div>
  );
};

export default OptionItem;
