import { Div } from '@stylin.js/elements';

import { Typography } from '@/elements/typography';

const RankedBooks = () => {
  return (
    <Div
      width="100%"
      display="grid"
      gap="L"
      alignItems="center"
      gridTemplateColumns="1.75rem 6.25rem 1fr 1.25rem"
    >
      <Typography variant="title" fontStyle="italic" size="medium">
        1
      </Typography>
      <Div width="6.25rem" height="9.375rem" backgroundColor="primary" />
      <Typography variant="body" size="medium">
        Book Title
      </Typography>
      <Typography variant="fancy" size="medium">
        4.6
      </Typography>

      <Typography variant="title" fontStyle="italic" size="medium">
        2
      </Typography>
      <Div width="6.25rem" height="9.375rem" backgroundColor="primary" />
      <Typography variant="body" size="medium">
        Book Title
      </Typography>
      <Typography variant="fancy" size="medium">
        4.6
      </Typography>

      <Typography variant="title" fontStyle="italic" size="medium">
        3
      </Typography>
      <Div width="6.25rem" height="9.375rem" backgroundColor="primary" />
      <Typography variant="body" size="medium">
        Book Title
      </Typography>
      <Typography variant="fancy" size="medium">
        4.6
      </Typography>
    </Div>
  );
};

export default RankedBooks;
