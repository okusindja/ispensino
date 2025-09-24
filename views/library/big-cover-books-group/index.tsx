import { Div } from '@stylin.js/elements';

const BigCoverBooksGroup = () => {
  return (
    <Div display="flex" gap="M" pr="M" width="100%" overflow="scroll">
      <Div
        width="150px"
        minWidth="150px"
        height="200px"
        // backgroundColor="primary"
        backgroundImage="url('https://bookcover4u.com/pro/Science-P1441712708SCB-Molecular-Science-Molecular-Science-educational-book-cover-molecular-science-h.JPG')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      />
      <Div
        width="150px"
        minWidth="150px"
        height="200px"
        backgroundColor="primary"
        backgroundImage="url('https://marketplace.canva.com/EAGKDB5TDz4/1/0/1131w/canva-yellow-and-blue-illustrative-science-notebook-cover-document-a4-Qnxztrhh-nI.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      />
      <Div
        width="150px"
        minWidth="150px"
        height="200px"
        backgroundColor="primary"
        backgroundImage="url('https://sciencefictionruminations.com/wp-content/uploads/2011/12/3wrldstq1964.jpeg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      />
      <Div
        width="150px"
        minWidth="150px"
        height="200px"
        backgroundColor="primary"
        backgroundImage="url('https://c8.alamy.com/comp/EXTJ38/1960s-usa-authentic-book-of-space-book-cover-EXTJ38.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      />
    </Div>
  );
};

export default BigCoverBooksGroup;
