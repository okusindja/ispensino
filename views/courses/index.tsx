import { Div } from '@stylin.js/elements';

import { Layout, TextField } from '@/components';
import ItemCard from '@/components/item-card';
import { SearchSVG } from '@/components/svg';
import { Box } from '@/elements';

const Courses = () => {
  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div width="100%" gridColumn="1/-1" mt="M">
          <TextField
            Prefix={<SearchSVG maxWidth="1rem" maxHeight="1rem" width="100%" />}
            placeholder="Procure por um curso..."
          />
        </Div>
        <ItemCard to="/content/courses/1" title="Title" />
        <ItemCard to="/content/courses/1" title="Title" />
        <ItemCard to="/content/courses/1" title="Title" />
        <ItemCard to="/content/courses/1" title="Title" />
      </Box>
    </Layout>
  );
};

export default Courses;
