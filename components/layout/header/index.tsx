import { Header as StylinHeader, Li, Ul } from '@stylin.js/elements';

import { useIsMobile } from '@/hooks';

import Mobile from './mobile';

const Header = () => {
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && (
        <StylinHeader zIndex="10" width="100%">
          <Ul>
            <Li>Home</Li>
            <Li>News</Li>
            <Li>About</Li>
          </Ul>
        </StylinHeader>
      )}
      {isMobile && <Mobile />}
    </>
  );
};

export default Header;
