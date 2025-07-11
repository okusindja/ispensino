import { Div } from '@stylin.js/elements';

import { Layout, TextField } from '@/components';
import { SearchSVG } from '@/components/svg';
import { Box } from '@/elements';
import { Typography } from '@/elements/typography';

import BigCoverBooksGroup from './big-cover-books-group';
import RankedBooks from './ranked-books';

const Library = () => {
  return (
    <Layout>
      <Box variant="container">
        <Div width="100%" gridColumn="1/-1">
          <Typography variant="headline" size="small">
            Lib
          </Typography>
          <TextField
            Prefix={<SearchSVG maxWidth="1rem" maxHeight="1rem" width="100%" />}
            placeholder="Pesquisar livros"
          />
          <Typography variant="title" size="small" my="L">
            Recent releases
          </Typography>
          <BigCoverBooksGroup />
          <Typography variant="title" size="small" my="L">
            Recent releases
          </Typography>
          <BigCoverBooksGroup />
          <Typography variant="title" size="small" my="L">
            Recent releases
          </Typography>
          <RankedBooks />
        </Div>
      </Box>
    </Layout>
  );
};

export default Library;
