import { Div } from '@stylin.js/elements';

import { Typography } from '@/elements/typography';

const RankedBooks = () => {
  return (
    <Div
      gap="L"
      color="text"
      width="100%"
      display="grid"
      alignItems="center"
      gridTemplateColumns="1.75rem 6.25rem 1fr 1.25rem"
    >
      <Typography variant="title" fontStyle="italic" size="medium">
        1
      </Typography>
      <Div
        width="6.25rem"
        height="9.375rem"
        backgroundColor="primary"
        backgroundImage="url('https://cdn.myportfolio.com/c3239f37fa800c662956e068d24615ac/c5657b4a-5d55-4fdb-9b51-888734fea5ec_rw_1920.jpg?h=f7311f43b9a9502a1df5fbeb7f93f807')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      />
      <Typography variant="body" size="medium">
        Book Title
      </Typography>
      <Typography variant="fancy" size="medium">
        4.6
      </Typography>

      <Typography variant="title" fontStyle="italic" size="medium">
        2
      </Typography>
      <Div
        width="6.25rem"
        height="9.375rem"
        backgroundColor="primary"
        backgroundImage="url('https://bookcoverzone.com/slir/w450/png24-front/bookcover0029422.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      />
      <Typography variant="body" size="medium">
        Book Title
      </Typography>
      <Typography variant="fancy" size="medium">
        4.6
      </Typography>

      <Typography variant="title" fontStyle="italic" size="medium">
        3
      </Typography>
      <Div
        width="6.25rem"
        height="9.375rem"
        backgroundColor="primary"
        backgroundImage="url('https://bookcoverzone.com/slir/h1000/png24-front/bookcover0034655.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      />
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
