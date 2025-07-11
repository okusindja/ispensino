import { Div } from '@stylin.js/elements';
import { FC } from 'react';

import { Layout } from '@/components';
import { Box } from '@/elements';

import { CourseDetailsProps } from './details.types';

const CourseDetails: FC<CourseDetailsProps> = ({ courseId }) => {
  return (
    <Layout hasGoBack>
      <Box variant="container">
        <Div width="100%" gridColumn="1 / -1">
          <h1>Course Details</h1>
          <p>Course ID: {courseId}</p>
          {/* Additional course details can be added here */}
        </Div>
      </Box>
    </Layout>
  );
};

export default CourseDetails;
