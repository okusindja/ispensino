import { css } from '@emotion/react';

const poppins = css`
  line-height: 'auto';
  font-family: 'Poppins', serif;
`;

const inter = css`
  line-height: 'auto';
  font-family: 'Inter', serif;
`;

const headline = css`
  ${poppins};
  font-style: normal;
  font-weight: 600;
`;

const title = css`
  ${inter};
  font-style: normal;
  font-weight: 500;
`;

const large = css`
  ${poppins};
  font-style: normal;
  font-weight: 400;
`;

const body = css`
  ${inter};
  font-style: normal;
  font-weight: 400;
`;

const fancy = css`
  ${poppins};
  font-style: normal;
  font-weight: 400;
`;

export default {
  title,
  headline,
  large,
  fancy,
  body,
};
