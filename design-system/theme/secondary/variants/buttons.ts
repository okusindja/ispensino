import { css } from '@emotion/react';

import pallete from '@/design-system/common/pallete';

import colors from '../colors';

const common = css`
  width: 100%;
  border: none;
  outline: none;
  display: flex;
  cursor: pointer;
  position: relative;
  border-radius: 0.5rem;
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
  color: ${pallete.NEUTRAL_900};
  background: ${colors.primary};
  ${effects};
`;

const secondary = css`
  ${shadow};
  ${common};
  color: ${colors.text};
  background: ${colors['surface_light']};
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
