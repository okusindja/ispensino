import { css } from '@emotion/react';

import colors from '../colors';

const common = css`
  border: none;
  outline: none;
  display: flex;
  cursor: pointer;
  position: relative;
  align-items: center;
  display: inline-block;
  justify-content: center;
`;

const shadow = css`
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.25);
`;

const effects = css`
  transition: all 300ms ease-in-out;
  &:hover {
    transform: scale(0.95);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.35);
  }
  &:disabled {
    cursor: not-allowed;
    background: ${colors.disabled};
  }
`;

const primary = css`
  ${shadow};
  ${common};
  color: ${colors.foreground};
  background: ${colors.primary};
  ${effects};
`;

const secondary = css`
  ${shadow};
  ${common};
  color: ${colors.primary};
  background: ${colors.secondary};
  ${effects};
`;

const tertiary = css`
  ${shadow};
  ${common};
  background: ${colors.tertiary};
  color: ${colors.primary};
  ${effects};
`;

const neutral = css`
  ${common};
  color: ${colors.foreground};
  background: transparent;
`;

const primaryVariant = css`
  ${common};
  color: ${colors.primary};
  background: linear-gradient(60deg, ${colors.secondary}, ${colors.tertiary});
`;

export default {
  primary,
  secondary,
  tertiary,
  neutral,
  primaryVariant,
};
